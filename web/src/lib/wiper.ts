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
  /** Stable ids for polish add-on choices (matches `polishOptionDefs`). */
  polishOptionIds?: string[];
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
    polishOptionIds: [
      "inner",
      "outer",
      "inner-outer",
      "frontal",
      "engine",
      "rings",
      "windshield",
      "single-side-glass",
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

export const polishOptionDefs: { id: string; label: Record<Locale, string> }[] = [
  { id: "inner", label: { en: "Inner", ar: "داخلي" } },
  { id: "outer", label: { en: "Outer", ar: "خارجي" } },
  { id: "inner-outer", label: { en: "Inner + outer", ar: "داخلي + خارجي" } },
  { id: "frontal", label: { en: "Frontal", ar: "أمامي" } },
  { id: "engine", label: { en: "Engine", ar: "المحرك" } },
  { id: "rings", label: { en: "Rings", ar: "الحلقات" } },
  { id: "windshield", label: { en: "Windshield", ar: "الزجاج الأمامي" } },
  { id: "single-side-glass", label: { en: "Single side glass", ar: "زجاج جانبي واحد" } },
];

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
    en: "Weekly wash, same selected day, monthly payment.",
    ar: "غسيل أسبوعي، نفس اليوم المختار، دفع شهري.",
  },
  oneTimeCardTitle: { en: "One time", ar: "مرة واحدة" },
  oneTimeCardBody: {
    en: "Pick the service you want today and pay once.",
    ar: "اختر الخدمة التي تريدها اليوم وادفع مرة واحدة.",
  },
  singleKicker: { en: "One time service", ar: "خدمة لمرة واحدة" },
  singleTitle: { en: "Choose your service.", ar: "اختر خدمتك." },
  polishKicker: { en: "Polish", ar: "تلميع" },
  polishTitle: { en: "What type?", ar: "أي نوع؟" },
  continue: { en: "Continue", ar: "متابعة" },
  subscriptionKicker: { en: "Subscription", ar: "اشتراك" },
  subscriptionHeroTitle: {
    en: "Weekly inner and outer wash.",
    ar: "غسيل داخلي وخارجي أسبوعي.",
  },
  subscriptionHeroBody: {
    en: "Subscription is limited to inner and outer washes. You pay once per month, choose a weekly day and time window, and WIPER creates recurring work orders for the staff.",
    ar: "الاشتراك مقتصر على الغسيل الداخلي والخارجي. تدفع مرة شهرياً، تختار يوماً أسبوعياً وفترة زمنية، ويقوم WIPER بإنشاء أوامر عمل متكررة للفريق.",
  },
  subscriptionTerms: {
    en: "I agree to the monthly subscription terms.",
    ar: "أوافق على شروط الاشتراك الشهري.",
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
  serviceIconOuter: { en: "OUT", ar: "خارجي" },
  serviceIconInnerOuter: { en: "IN", ar: "د+خ" },
  serviceIconVip: { en: "VIP", ar: "VIP" },
  serviceIconPolish: { en: "POL", ar: "لم" },
  serviceIconSub: { en: "SUB", ar: "شهر" },
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
    service: "VIP wash",
    status: "assigned",
    zone: "The Pearl",
    slot: "17:00 - 18:00",
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
    slot: "18:00 - 19:00",
    amount: 280,
  },
  {
    id: "WO-2050",
    customer: "Noora Saleh",
    plateNumber: "QTR-21944",
    service: "Outer + inner",
    status: "in_progress",
    zone: "Lusail",
    slot: "16:00 - 17:00",
    worker: "Khaled Nasser",
    amount: 80,
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
