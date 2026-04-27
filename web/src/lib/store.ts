import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import { assignWorker, workOrders as seededOrders, type OrderStatus, workers } from "@/lib/wiper";

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
};

type CreateSubscriptionInput = {
  customer: string;
  plateNumber: string;
  weekday: string;
  slot: string;
  zone: string;
  amount: number;
};

function inMemoryStore() {
  const globalKey = "__wiper_in_memory_store__";
  const state = globalThis as typeof globalThis & {
    [globalKey]?: { orders: OrderRecord[]; subscriptions: SubscriptionRecord[] };
  };

  if (!state[globalKey]) {
    state[globalKey] = {
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
  } catch {
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
    scheduledFor: nextWeekdayDate(input.day, input.slot).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDb();
    await db.collection<OrderRecord>("orders").insertOne(order);
  } catch {
    inMemoryStore().orders.push(order);
  }

  return order;
}

export async function updateOrderStatus(id: string, nextStatus: OrderStatus) {
  try {
    const db = await getDb();
    const result = await db
      .collection<OrderRecord>("orders")
      .findOneAndUpdate(
        { id },
        { $set: { status: nextStatus, updatedAt: new Date().toISOString() } },
        { returnDocument: "after" },
      );
    return result;
  } catch {
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
  } catch {
    return inMemoryStore().subscriptions;
  }
}

export async function createSubscription(input: CreateSubscriptionInput) {
  const subscription: SubscriptionRecord = {
    id: `SUB-${randomUUID().slice(0, 8).toUpperCase()}`,
    customer: input.customer,
    plateNumber: input.plateNumber,
    weekday: input.weekday,
    slot: input.slot,
    zone: input.zone,
    amount: input.amount,
    status: "active",
    generatedWorkOrders: 4,
    createdAt: new Date().toISOString(),
  };

  const generatedOrders: OrderRecord[] = Array.from({ length: 4 }).map((_, index) => {
    const worker = assignWorker(input.zone);
    const now = new Date().toISOString();
    return {
      id: `WO-${Date.now().toString().slice(-4)}${index + 1}`,
      customer: input.customer,
      plateNumber: input.plateNumber,
      service: "Monthly subscription",
      status: inferStatus(input.zone),
      zone: input.zone,
      day: input.weekday,
      slot: input.slot,
      worker: worker?.name,
      amount: input.amount,
      kind: "subscription",
      subscriptionId: subscription.id,
      scheduledFor: nextWeekdayDate(input.weekday, input.slot, index).toISOString(),
      createdAt: now,
      updatedAt: now,
    };
  });

  try {
    const db = await getDb();
    await db.collection<SubscriptionRecord>("subscriptions").insertOne(subscription);
    await db.collection<OrderRecord>("orders").insertMany(generatedOrders);
  } catch {
    const store = inMemoryStore();
    store.subscriptions.push(subscription);
    store.orders.push(...generatedOrders);
  }

  return { subscription, generatedOrders };
}

export function detectZone(address: string) {
  return inferZone(address);
}
