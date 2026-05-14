import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import { allowMongoInMemoryFallback } from "@/lib/mongodb-env";
import {
  assignWorker,
  combinedLocalDateTime,
  weekdayValueFromISODate,
  workOrders as seededOrders,
  type OrderStatus,
  workers,
} from "@/lib/wiper";

export type OrderRecord = {
  id: string;
  customer: string;
  plateNumber: string;
  service: string;
  status: OrderStatus;
  zone: string;
  day: string;
  slot: string;
  worker?: string;
  amount: number;
  scheduledFor: string;
  subscriptionId?: string;
  kind: "single" | "subscription";
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionRecord = {
  id: string;
  customer: string;
  plateNumber: string;
  weekday: string;
  slot: string;
  zone: string;
  amount: number;
  status: "active" | "paused" | "cancelled";
  generatedWorkOrders: number;
  createdAt: string;
};

export type InquiryRecord = {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
};

type CreateOrderInput = {
  customer: string;
  plateNumber: string;
  service: string;
  zone: string;
  day: string;
  slot: string;
  amount: number;
  subscriptionId?: string;
  kind: "single" | "subscription";
  /** YYYY-MM-DD — when set, `scheduledFor` uses this date with the slot start time. */
  scheduledDate?: string;
};

type CreateSubscriptionInput = {
  customer: string;
  plateNumber: string;
  weekday: string;
  slot: string;
  zone: string;
  amount: number;
  /** YYYY-MM-DD — first visit anchor; weekday is derived from this when present. */
  scheduledDate?: string;
  visitCount: number;
  packageLabelEn: string;
};

function inMemoryStore() {
  const globalKey = "__wiper_in_memory_store__";
  const state = globalThis as typeof globalThis & {
    [globalKey]?: {
      orders: OrderRecord[];
      subscriptions: SubscriptionRecord[];
      inquiries: InquiryRecord[];
    };
  };

  if (!state[globalKey]) {
    state[globalKey] = {
      inquiries: [] as InquiryRecord[],
      orders: seededOrders.map((order) => {
        const now = new Date().toISOString();
        return {
          ...order,
          day: "Monday",
          kind: order.service.toLowerCase().includes("subscription") ? "subscription" : "single",
          scheduledFor: now,
          createdAt: now,
          updatedAt: now,
        };
      }),
      subscriptions: [],
    };
  }

  return state[globalKey];
}

function startTimeFromSlot(slot: string) {
  const [time] = slot.split("-").map((item) => item.trim());
  const [hours, minutes] = time.split(":").map((item) => Number(item));
  return { hours: Number.isNaN(hours) ? 10 : hours, minutes: Number.isNaN(minutes) ? 0 : minutes };
}

function nextWeekdayDate(weekday: string, slot: string, weekOffset = 0) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const targetIndex = Math.max(0, days.indexOf(weekday));
  const now = new Date();
  const date = new Date(now);
  const diff = (targetIndex - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + diff + weekOffset * 7);
  const { hours, minutes } = startTimeFromSlot(slot);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/** Weekly anchor: one visit per week on the chosen weekday. */
function subscriptionVisitIsoDates(
  scheduledDate: string | undefined,
  weekday: string,
  slot: string,
  visitCount: number,
): string[] {
  const first =
    scheduledDate && /^\d{4}-\d{2}-\d{2}$/.test(scheduledDate)
      ? combinedLocalDateTime(scheduledDate, slot)
      : nextWeekdayDate(weekday, slot, 0);

  if (visitCount <= 4) {
    return Array.from({ length: visitCount }, (_, index) => {
      const d = new Date(first);
      d.setDate(d.getDate() + index * 7);
      return d.toISOString();
    });
  }

  const out: string[] = [];
  for (let week = 0; week < 4; week++) {
    for (let visitInWeek = 0; visitInWeek < 2; visitInWeek++) {
      if (out.length >= visitCount) break;
      const d = new Date(first);
      d.setDate(d.getDate() + week * 7 + visitInWeek * 3);
      out.push(d.toISOString());
    }
  }
  return out;
}

function inferStatus(zone: string) {
  return assignWorker(zone) ? "assigned" : "unassigned";
}

function inferZone(address: string) {
  const lowered = address.toLowerCase();
  const matched = workers.find((worker) => lowered.includes(worker.zone.toLowerCase()));
  return matched?.zone ?? "West Bay";
}

export async function listOrders() {
  try {
    const db = await getDb();
    return (await db
      .collection<OrderRecord>("orders")
      .find({})
      .sort({ scheduledFor: 1, createdAt: 1 })
      .toArray()) as OrderRecord[];
  } catch (error) {
    if (!allowMongoInMemoryFallback()) throw error;
    console.warn("[wiper] listOrders: Mongo unavailable, using in-memory store.", error);
    return inMemoryStore().orders;
  }
}

export async function createOrder(input: CreateOrderInput) {
  const worker = assignWorker(input.zone);
  const order: OrderRecord = {
    id: `WO-${Date.now().toString().slice(-6)}`,
    customer: input.customer,
    plateNumber: input.plateNumber,
    service: input.service,
    zone: input.zone,
    day: input.day,
    slot: input.slot,
    amount: input.amount,
    status: inferStatus(input.zone),
    worker: worker?.name,
    kind: input.kind,
    subscriptionId: input.subscriptionId,
    scheduledFor:
      input.scheduledDate && /^\d{4}-\d{2}-\d{2}$/.test(input.scheduledDate)
        ? combinedLocalDateTime(input.scheduledDate, input.slot).toISOString()
        : nextWeekdayDate(input.day, input.slot).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDb();
    await db.collection<OrderRecord>("orders").insertOne(order);
  } catch (error) {
    if (!allowMongoInMemoryFallback()) throw error;
    console.warn("[wiper] createOrder: Mongo unavailable, using in-memory store.", error);
    inMemoryStore().orders.push(order);
  }

  return order;
}

export async function updateOrderStatus(id: string, nextStatus: OrderStatus) {
  try {
    const db = await getDb();
    const collection = db.collection<OrderRecord>("orders");
    const update = await collection.updateOne(
      { id },
      { $set: { status: nextStatus, updatedAt: new Date().toISOString() } },
    );
    if (update.matchedCount === 0) return null;
    return (await collection.findOne({ id })) as OrderRecord | null;
  } catch (error) {
    if (!allowMongoInMemoryFallback()) throw error;
    console.warn("[wiper] updateOrderStatus: Mongo unavailable, using in-memory store.", error);
    const store = inMemoryStore();
    const order = store.orders.find((item) => item.id === id);
    if (!order) return null;
    order.status = nextStatus;
    order.updatedAt = new Date().toISOString();
    return order;
  }
}

export async function listSubscriptions() {
  try {
    const db = await getDb();
    return (await db
      .collection<SubscriptionRecord>("subscriptions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()) as SubscriptionRecord[];
  } catch (error) {
    if (!allowMongoInMemoryFallback()) throw error;
    console.warn("[wiper] listSubscriptions: Mongo unavailable, using in-memory store.", error);
    return inMemoryStore().subscriptions;
  }
}

export async function createSubscription(input: CreateSubscriptionInput) {
  const resolvedWeekday = input.scheduledDate
    ? weekdayValueFromISODate(input.scheduledDate)
    : input.weekday;
  const scheduleTimes = subscriptionVisitIsoDates(
    input.scheduledDate,
    resolvedWeekday,
    input.slot,
    input.visitCount,
  );

  const subscription: SubscriptionRecord = {
    id: `SUB-${randomUUID().slice(0, 8).toUpperCase()}`,
    customer: input.customer,
    plateNumber: input.plateNumber,
    weekday: resolvedWeekday,
    slot: input.slot,
    zone: input.zone,
    amount: input.amount,
    status: "active",
    generatedWorkOrders: input.visitCount,
    createdAt: new Date().toISOString(),
  };

  const lineService = `Subscription · ${input.packageLabelEn}`;

  const generatedOrders: OrderRecord[] = Array.from({ length: input.visitCount }).map((_, index) => {
    const worker = assignWorker(input.zone);
    const now = new Date().toISOString();
    return {
      id: `WO-${Date.now()}-${index}-${randomUUID().slice(0, 4)}`,
      customer: input.customer,
      plateNumber: input.plateNumber,
      service: lineService,
      status: inferStatus(input.zone),
      zone: input.zone,
      day: resolvedWeekday,
      slot: input.slot,
      worker: worker?.name,
      amount: input.amount,
      kind: "subscription",
      subscriptionId: subscription.id,
      scheduledFor: scheduleTimes[index] ?? now,
      createdAt: now,
      updatedAt: now,
    };
  });

  try {
    const db = await getDb();
    await db.collection<SubscriptionRecord>("subscriptions").insertOne(subscription);
    await db.collection<OrderRecord>("orders").insertMany(generatedOrders);
  } catch (error) {
    if (!allowMongoInMemoryFallback()) throw error;
    console.warn("[wiper] createSubscription: Mongo unavailable, using in-memory store.", error);
    const store = inMemoryStore();
    store.subscriptions.push(subscription);
    store.orders.push(...generatedOrders);
  }

  return { subscription, generatedOrders };
}

export function detectZone(address: string) {
  return inferZone(address);
}

export async function listInquiries() {
  try {
    const db = await getDb();
    return (await db
      .collection<InquiryRecord>("inquiries")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()) as InquiryRecord[];
  } catch (error) {
    if (!allowMongoInMemoryFallback()) throw error;
    console.warn("[wiper] listInquiries: Mongo unavailable, using in-memory store.", error);
    return [...inMemoryStore().inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
}

export async function createInquiry(input: { name: string; phone: string; message: string }) {
  const inquiry: InquiryRecord = {
    id: `INQ-${Date.now().toString().slice(-8)}`,
    name: input.name.trim() || "Visitor",
    phone: input.phone.trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const db = await getDb();
    await db.collection<InquiryRecord>("inquiries").insertOne(inquiry);
  } catch (error) {
    if (!allowMongoInMemoryFallback()) throw error;
    console.warn("[wiper] createInquiry: Mongo unavailable, using in-memory store.", error);
    inMemoryStore().inquiries.unshift(inquiry);
  }

  console.info("[wiper] Admin notification: new inquiry", inquiry.id, inquiry.phone);
  return inquiry;
}
