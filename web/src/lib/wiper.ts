export type Locale = "en" | "ar";
export type ServiceKind = "single" | "subscription";
/** One-time pricing: salon uses the lower band; SUV uses the upper band. */
export type VehicleClass = "salon" | "suv";

/** Public Instagram (override with NEXT_PUBLIC_INSTAGRAM_URL). */
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "https://www.instagram.com/wiperqa/";
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
  /** Minimum price in QAR (used at checkout). */
  price: number;
  /** When set, UI shows a price band (e.g. 55–65). */
  priceMax?: number;
  durationMinutes: number;
  kind: ServiceKind;
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
    id: "quick-wipe",
    label: { en: "Quick Wipe", ar: "مسحة سريعة" },
    description: {
      en: "Inside · Outside — fast refresh.",
      ar: "داخل · خارج — انتعاش سريع.",
    },
    price: 55,
    priceMax: 65,
    durationMinutes: 45,
    kind: "single",
  },
  {
    id: "wax-wipe",
    label: { en: "Wax Wipe", ar: "مسحة شمعية" },
    description: {
      en: "Inside · Outside · wax shine for a couple of days.",
      ar: "داخل · خارج · لمعان شمعي لعدة أيام.",
    },
    price: 75,
    priceMax: 85,
    durationMinutes: 60,
    kind: "single",
  },
  {
    id: "deep-wipe",
    label: { en: "Deep Wipe", ar: "مسحة عميقة" },
    description: {
      en: "Inside · Outside · wax · vacuum · sanitize · engine wash (on request) · perfuming.",
      ar: "داخل · خارج · شمع · مكنسة · تعقيم · غسيل محرك (حسب الطلب) · عطور.",
    },
    price: 100,
    priceMax: 120,
    durationMinutes: 120,
    kind: "single",
  },
  {
    id: "sub-4-row",
    label: { en: "4 in a row", ar: "٤ متتالية" },
    description: {
      en: "1 Quick Wipe per week (4 visits per billing period).",
      ar: "مسحة سريعة واحدة أسبوعياً (٤ زيارات لكل فترة).",
    },
    price: 210,
    priceMax: 250,
    durationMinutes: 45,
    kind: "subscription",
  },
  {
    id: "sub-8-pool",
    label: { en: "8 pool", ar: "٨ حزمة" },
    description: {
      en: "2 Quick Wipes per week — can be used for 2 cars.",
      ar: "مسحتان سريعتان أسبوعياً — يمكن استخدامهما لسيارتين.",
    },
    price: 420,
    priceMax: 500,
    durationMinutes: 90,
    kind: "subscription",
  },
];

/** First reservation 15:00, last window ends 22:00 (10pm). */
export const timeSlots = [
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
];

/** Service areas (stored as the English zone name for orders and routing). */
export const SERVICE_LOCATIONS = [
  "West Bay",
  "The Pearl",
  "Lusail",
  "Al Dafna",
  "Msheireb",
  "Al Sadd",
  "Bin Mahmoud",
  "Al Waab",
  "Ain Khaled",
  "Abu Hamour",
  "Al Thumama",
  "Al Maamoura",
  "Old Airport",
  "Al Hilal",
  "Najma",
  "Umm Ghuwailina",
  "Madinat Khalifa",
  "Al Duhail",
  "Al Gharafa",
  "Muaither",
  "Bani Hajer",
  "Al Wajba",
  "Al Markhiya",
  "Umm Lekhba",
  "Izghawa",
  "Al Sailiya",
  "Abu Nakhla",
  "Leqtaifiya",
  "Al Wakrah",
  "Al Wukair",
] as const;

export type ServiceLocation = (typeof SERVICE_LOCATIONS)[number];

export const CONTACT_PHONE_DISPLAY = "+974 7767 6160";
export const CONTACT_PHONE_TEL = "+97477676160";

/** English weekday value sent to APIs; localized label for UI. */
export const weekdayOptions: { value: string; label: Record<Locale, string> }[] = [
  { value: "Sunday", label: { en: "Sunday", ar: "الأحد" } },
  { value: "Monday", label: { en: "Monday", ar: "الإثنين" } },
  { value: "Tuesday", label: { en: "Tuesday", ar: "الثلاثاء" } },
  { value: "Wednesday", label: { en: "Wednesday", ar: "الأربعاء" } },
  { value: "Thursday", label: { en: "Thursday", ar: "الخميس" } },
  { value: "Friday", label: { en: "Friday", ar: "الجمعة" } },
  { value: "Saturday", label: { en: "Saturday", ar: "السبت" } },
];

export const availableDays = weekdayOptions.map((item) => item.value);

export function formatISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function weekdayValueFromISODate(iso: string): string {
  const parts = iso.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return "Sunday";
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return weekdayOptions[d.getDay()]?.value ?? "Sunday";
}

/** Local calendar date at the start time of the booking slot window. */
export function combinedLocalDateTime(isoDate: string, slot: string): Date {
  const parts = isoDate.split("-").map(Number);
  const y = parts[0] ?? 1970;
  const mo = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const d = new Date(y, mo - 1, day);
  const [start] = slot.split("-").map((item) => item.trim());
  const [hStr, mStr] = (start ?? "15:00").split(":");
  const hours = Number(hStr);
  const minutes = Number(mStr);
  d.setHours(Number.isNaN(hours) ? 15 : hours, Number.isNaN(minutes) ? 0 : minutes, 0, 0);
  return d;
}

export const bookCopy = {
  back: { en: "Back", ar: "رجوع" },
  /** Shown when UI is English — switches to Arabic. */
  langSwitchToAr: { en: "العربية", ar: "العربية" },
  /** Shown when UI is Arabic — switches to English. */
  langSwitchToEn: { en: "English", ar: "English" },
  choiceKicker: { en: "Get washed", ar: "احصل على غسيل" },
  choiceTitle: { en: "What kind of wash do you need?", ar: "ما نوع الغسيل الذي تحتاجه؟" },
  subscriptionCardTitle: { en: "Subscription", ar: "اشتراك" },
  subscriptionCardBody: {
    en: "4 in a row or 8 pool — Quick Wipe visits on your schedule.",
    ar: "٤ متتائية أو حزمة ٨ — زيارات مسحة سريعة حسب موعدك.",
  },
  oneTimeCardTitle: { en: "One time", ar: "مرة واحدة" },
  oneTimeCardBody: {
    en: "Quick Wipe, Wax Wipe, or Deep Wipe — pay once.",
    ar: "مسحة سريعة، مسحة شمعية، أو مسحة عميقة — ادفع مرة واحدة.",
  },
  vehicleKicker: { en: "Vehicle type", ar: "نوع المركبة" },
  vehicleTitle: { en: "Salon or SUV?", ar: "سيدان أم دفع رباعي؟" },
  vehicleSalonTitle: { en: "Salon / sedan", ar: "سيدان / سالون" },
  vehicleSalonHint: {
    en: "Uses the lower price in each service range.",
    ar: "يُطبَّق السعر الأدنى لكل خدمة.",
  },
  vehicleSuvTitle: { en: "SUV", ar: "دفع رباعي" },
  vehicleSuvHint: {
    en: "Uses the upper price in each service range.",
    ar: "يُطبَّق السعر الأعلى لكل خدمة.",
  },
  singleKicker: { en: "One time service", ar: "خدمة لمرة واحدة" },
  singleTitle: { en: "Choose your service.", ar: "اختر خدمتك." },
  continue: { en: "Continue", ar: "متابعة" },
  subscriptionKicker: { en: "Subscription", ar: "اشتراك" },
  pickPlanTitle: { en: "Pick your plan.", ar: "اختر باقتك." },
  subscriptionHeroTitle: {
    en: "Quick Wipe subscriptions.",
    ar: "اشتراكات المسحة السريعة.",
  },
  subscriptionHeroBody: {
    en: "Choose 4 in a row (1 Quick Wipe per week) or 8 pool (2 per week, can cover two cars). Pick your day, time window, and pay once per billing period.",
    ar: "اختر ٤ متتالية (مسحة سريعة أسبوعياً) أو حزمة ٨ (مسحتان أسبوعياً، يمكن لسيارتين). اختر اليوم والفترة وادفع مرة لكل فترة.",
  },
  subscriptionTerms: {
    en: "I agree to the subscription terms.",
    ar: "أوافق على شروط الاشتراك.",
  },
  detailsKicker: { en: "Final step", ar: "الخطوة الأخيرة" },
  detailsTitle: { en: "Info, schedule, payment.", ar: "البيانات، الموعد، الدفع." },
  placeholderName: { en: "Customer name *", ar: "اسم العميل *" },
  placeholderPlate: { en: "Car plate number *", ar: "رقم اللوحة *" },
  placeholderPhone: { en: "Phone *", ar: "الهاتف *" },
  chooseLocation: { en: "Choose location", ar: "اختر الموقع" },
  searchLocations: { en: "Search areas…", ar: "بحث في المناطق…" },
  serviceDate: { en: "Service date *", ar: "تاريخ الخدمة *" },
  bookingDate: { en: "Date", ar: "التاريخ" },
  placeholderCarDetails: { en: "Car details", ar: "تفاصيل السيارة" },
  placeholderNote: { en: "Note", ar: "ملاحظة" },
  placeholderPromo: { en: "Promo code", ar: "رمز ترويجي" },
  apply: { en: "Apply", ar: "تطبيق" },
  promoInvalid: { en: "Promo code not valid.", ar: "رمز ترويجي غير صالح." },
  promoAppliedLine: {
    en: "{code} applied: -{discount}",
    ar: "تم تطبيق {code}: -{discount}",
  },
  total: { en: "Total", ar: "الإجمالي" },
  payNow: { en: "Pay now", ar: "ادفع الآن" },
  processing: { en: "Processing...", ar: "جاري المعالجة..." },
  payment: { en: "Payment", ar: "الدفع" },
  customer: { en: "Customer", ar: "العميل" },
  plate: { en: "Plate", ar: "اللوحة" },
  service: { en: "Service", ar: "الخدمة" },
  day: { en: "Day", ar: "اليوم" },
  zoneLabel: { en: "Location", ar: "الموقع" },
  time: { en: "Time", ar: "الوقت" },
  notSet: { en: "Not set", ar: "غير محدد" },
  notSelected: { en: "Not selected", ar: "غير محدد" },
  subtotal: { en: "Subtotal", ar: "المجموع الفرعي" },
  promo: { en: "Promo", ar: "ترويجي" },
  orderPlaced: { en: "Order placed", ar: "تم تأكيد الطلب" },
  receiptBody: {
    en: "Receipt {id} has been created. We will confirm your booking using the phone number you provided.",
    ar: "تم إنشاء الإيصال {id}. سنتواصل معك لتأكيد الحجز عبر رقم الهاتف الذي أدخلته.",
  },
  done: { en: "Done", ar: "تم" },
  errSubscription: { en: "Unable to create subscription.", ar: "تعذر إنشاء الاشتراك." },
  errOrder: { en: "Unable to create order.", ar: "تعذر إنشاء الطلب." },
  errGeneric: {
    en: "Something went wrong while placing the booking.",
    ar: "حدث خطأ أثناء إتمام الحجز.",
  },
  altRibbon: {
    en: "WIPER booking ribbon pattern",
    ar: "نمط شريط حجز WIPER",
  },
  altLogo: { en: "WIPER logo", ar: "شعار WIPER" },
  altHome: { en: "WIPER home", ar: "الرئيسية WIPER" },
  altSubscriptionVisual: {
    en: "WIPER logo on navy background",
    ar: "شعار WIPER على خلفية كحلية",
  },
  serviceIconQuick: { en: "QK", ar: "س" },
  serviceIconWax: { en: "WX", ar: "ش" },
  serviceIconDeep: { en: "DP", ar: "ع" },
  serviceIconSub4: { en: "4", ar: "٤" },
  serviceIconSub8: { en: "8", ar: "٨" },
} as const;

function fillBookTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

export function formatBookReceiptBody(locale: Locale, receiptId: string) {
  return fillBookTemplate(bookCopy.receiptBody[locale], { id: receiptId });
}

export function formatPromoAppliedMessage(locale: Locale, code: string, discount: string) {
  return fillBookTemplate(bookCopy.promoAppliedLine[locale], { code, discount });
}

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
    service: "Deep Wipe",
    status: "assigned",
    zone: "The Pearl",
    slot: "17:00 - 18:00",
    worker: "Omar Hassan",
    amount: 100,
  },
  {
    id: "WO-2049",
    customer: "Fahad Al Kuwari",
    plateNumber: "QTR-55092",
    service: "Subscription · 8 pool",
    status: "new",
    zone: "West Bay",
    slot: "18:00 - 19:00",
    amount: 420,
  },
  {
    id: "WO-2050",
    customer: "Noora Saleh",
    plateNumber: "QTR-21944",
    service: "Wax Wipe",
    status: "in_progress",
    zone: "Lusail",
    slot: "16:00 - 17:00",
    worker: "Khaled Nasser",
    amount: 75,
  },
];

export const promoCodes: PromoCode[] = [
  { code: "WIPER10", kind: "percent", value: 10, active: true },
  { code: "QATAR25", kind: "fixed", value: 25, active: true },
  { code: "WELCOME15", kind: "percent", value: 15, active: true },
];

export function formatQar(amount: number, locale: Locale = "en") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-QA" : "en-QA", {
    style: "currency",
    currency: "QAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Display a QAR price band (e.g. 55–65). */
export function formatQarRange(locale: Locale, min: number, max: number) {
  if (min === max || !Number.isFinite(max)) return formatQar(min, locale);
  return `${formatQar(min, locale)}–${formatQar(max, locale)}`;
}

/** Amount charged for a one-time service given salon (min) vs SUV (max of band). */
export function priceForVehicleClass(service: ServiceOption | undefined, vehicleClass: VehicleClass): number {
  if (!service) return 0;
  if (service.kind === "subscription") return service.price;
  return vehicleClass === "suv" ? (service.priceMax ?? service.price) : service.price;
}

export function calculatePrice(serviceId: string, vehicleClass: VehicleClass = "salon") {
  const service = services.find((item) => item.id === serviceId);
  return priceForVehicleClass(service, vehicleClass);
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
