export type Locale = "en" | "ar";
export type ServiceKind = "single" | "subscription";
export type OrderStatus =
  | "new"
  | "assigned"
  | "in_progress"
  | "completed"
  | "unassigned";

export type ServiceOption = {
  id: string;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
  price: number;
  durationMinutes: number;
  kind: ServiceKind;
  polishOptions?: string[];
};

export type Worker = {
  id: string;
  name: string;
  zone: string;
  rating: number;
  activeJobs: number;
  shift: string;
  location: string;
};

export type WorkOrder = {
  id: string;
  customer: string;
  plateNumber: string;
  service: string;
  status: OrderStatus;
  zone: string;
  slot: string;
  worker?: string;
  amount: number;
};

export type PromoCode = {
  code: string;
  kind: "percent" | "fixed";
  value: number;
  active: boolean;
};

export const brand = {
  colors: {
    pink: "#FF007D",
    navy: "#1E3951",
    white: "#FFFFFF",
    teal: "#449883",
    rose: "#D07D7A",
    gold: "#E3C678",
    cream: "#FBF3A7",
    charcoal: "#262626",
  },
  tagline: {
    en: "On-demand mobile car wash in Qatar.",
    ar: "غسيل سيارات متنقل عند الطلب في قطر.",
  },
};

export const services: ServiceOption[] = [
  {
    id: "outer",
    label: { en: "Outer wash", ar: "غسيل خارجي" },
    description: {
      en: "Fast exterior clean for a sharp daily finish.",
      ar: "تنظيف خارجي سريع لمظهر يومي أنيق.",
    },
    price: 45,
    durationMinutes: 45,
    kind: "single",
  },
  {
    id: "inner-outer",
    label: { en: "Outer + inner", ar: "غسيل خارجي وداخلي" },
    description: {
      en: "Complete cabin and body wash.",
      ar: "تنظيف كامل للمقصورة والهيكل.",
    },
    price: 80,
    durationMinutes: 75,
    kind: "single",
  },
  {
    id: "vip",
    label: { en: "VIP wash", ar: "غسيل VIP" },
    description: {
      en: "Premium detail with extra care on finish and cabin.",
      ar: "تنظيف فاخر بعناية إضافية للهيكل والمقصورة.",
    },
    price: 150,
    durationMinutes: 120,
    kind: "single",
  },
  {
    id: "polish",
    label: { en: "Polish", ar: "تلميع" },
    description: {
      en: "Choose the exact areas you want polished.",
      ar: "اختر المناطق التي تريد تلميعها.",
    },
    price: 60,
    durationMinutes: 90,
    kind: "single",
    polishOptions: [
      "Inner",
      "Outer",
      "Inner + outer",
      "Frontal",
      "Engine",
      "Rings",
      "Windshield",
      "Single side glass",
    ],
  },
  {
    id: "monthly",
    label: { en: "Monthly subscription", ar: "اشتراك شهري" },
    description: {
      en: "Weekly inner + outer wash on your selected day.",
      ar: "غسيل داخلي وخارجي أسبوعي في اليوم الذي تختاره.",
    },
    price: 280,
    durationMinutes: 75,
    kind: "subscription",
  },
];

export const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
];

export const availableDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const workers: Worker[] = [
  {
    id: "wrk-101",
    name: "Omar Hassan",
    zone: "The Pearl",
    rating: 4.9,
    activeJobs: 1,
    shift: "08:00 - 16:00",
    location: "The Pearl Qatar",
  },
  {
    id: "wrk-102",
    name: "Yousef Ali",
    zone: "West Bay",
    rating: 4.7,
    activeJobs: 0,
    shift: "12:00 - 22:00",
    location: "West Bay",
  },
  {
    id: "wrk-103",
    name: "Khaled Nasser",
    zone: "Lusail",
    rating: 4.8,
    activeJobs: 2,
    shift: "09:00 - 19:00",
    location: "Lusail Marina",
  },
];

export const workOrders: WorkOrder[] = [
  {
    id: "WO-2048",
    customer: "Maha Al Thani",
    plateNumber: "QTR-83417",
    service: "VIP wash",
    status: "assigned",
    zone: "The Pearl",
    slot: "10:00 - 12:00",
    worker: "Omar Hassan",
    amount: 150,
  },
  {
    id: "WO-2049",
    customer: "Fahad Al Kuwari",
    plateNumber: "QTR-55092",
    service: "Monthly subscription",
    status: "new",
    zone: "West Bay",
    slot: "15:00 - 16:00",
    amount: 280,
  },
  {
    id: "WO-2050",
    customer: "Noora Saleh",
    plateNumber: "QTR-21944",
    service: "Outer + inner",
    status: "in_progress",
    zone: "Lusail",
    slot: "14:00 - 15:15",
    worker: "Khaled Nasser",
    amount: 80,
  },
];

export const promoCodes: PromoCode[] = [
  { code: "WIPER10", kind: "percent", value: 10, active: true },
  { code: "QATAR25", kind: "fixed", value: 25, active: true },
  { code: "WELCOME15", kind: "percent", value: 15, active: true },
];

export function formatQar(amount: number) {
  return new Intl.NumberFormat("en-QA", {
    style: "currency",
    currency: "QAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculatePrice(serviceId: string, polishCount: number) {
  const service = services.find((item) => item.id === serviceId);
  if (!service) return 0;
  return service.id === "polish"
    ? service.price + Math.max(0, polishCount - 1) * 25
    : service.price;
}

export function isSlotAvailable(slot: string) {
  const activeOrders = workOrders.filter(
    (order) => order.slot.includes(slot.slice(0, 5)) && order.status !== "completed",
  ).length;
  return workers.length - activeOrders > 0;
}

export function assignWorker(zone: string) {
  return [...workers]
    .sort((a, b) => {
      const zoneScore = Number(b.zone === zone) - Number(a.zone === zone);
      if (zoneScore !== 0) return zoneScore;
      if (a.activeJobs !== b.activeJobs) return a.activeJobs - b.activeJobs;
      return b.rating - a.rating;
    })
    .at(0);
}

export function getPromoByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  return promoCodes.find((promo) => promo.code === normalized && promo.active);
}

export function calculatePromoDiscount(amount: number, code: string) {
  const promo = getPromoByCode(code);
  if (!promo) return { promo: null, discount: 0 };

  const rawDiscount =
    promo.kind === "percent" ? Math.round((amount * promo.value) / 100) : promo.value;
  const discount = Math.min(amount, Math.max(0, rawDiscount));
  return { promo, discount };
}
