"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  bookCopy,
  calculatePrice,
  calculatePromoDiscount,
  formatBookReceiptBody,
  formatISODateLocal,
  formatPromoAppliedMessage,
  formatQar,
  formatQarRange,
  isSlotAvailable,
  priceForVehicleClass,
  services,
  timeSlots,
  weekdayValueFromISODate,
  weekdayOptions,
  SERVICE_LOCATIONS,
  type Locale,
  type ServiceKind,
  type VehicleClass,
} from "@/lib/wiper";
import { toggleLocale, usePreferredLocale } from "@/lib/locale";
import { ServiceLocationModal } from "@/components/ServiceLocationModal";

type Step = "choice" | "vehicle-type" | "single-service" | "subscription" | "details";

function bookingProgressIndex(step: Step): number {
  if (step === "choice") return 0;
  if (step === "vehicle-type" || step === "single-service" || step === "subscription") return 1;
  return 2;
}

function ServiceIcon({ label, variant }: { label: string; variant?: "dark" }) {
  return (
    <div className="mx-auto">
      <div
        className={`relative grid h-16 w-16 place-items-center rounded-[1.35rem] text-white shadow-[0_14px_35px_rgba(255,0,125,0.22)] sm:h-20 sm:w-20 ${
        variant === "dark" ? "bg-[#1E3951]" : "bg-[#FF007D]"
        }`}
      >
        <svg className="h-full w-full p-3" viewBox="0 0 80 80" aria-hidden="true">
          <path
            d="M16 36 C30 18, 48 52, 64 28"
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="7"
          />
          <path
            d="M22 53 C35 42, 46 64, 58 49"
            fill="none"
            opacity="0.55"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="5"
          />
        </svg>
      </div>
      <span className="mt-2 block text-center text-[0.65rem] font-black tracking-[0.2em] text-[#1E3951]">
        {label}
      </span>
    </div>
  );
}

function serviceCardAbbrev(serviceId: string, loc: Locale) {
  switch (serviceId) {
    case "quick-wipe":
      return bookCopy.serviceIconQuick[loc];
    case "wax-wipe":
      return bookCopy.serviceIconWax[loc];
    case "deep-wipe":
      return bookCopy.serviceIconDeep[loc];
    case "sub-4-row":
      return bookCopy.serviceIconSub4[loc];
    case "sub-8-pool":
      return bookCopy.serviceIconSub8[loc];
    default:
      return "";
  }
}

function ChoiceIcon({ type }: { type: "subscription" | "single" }) {
  const isSubscription = type === "subscription";

  return (
    <div
      className={`mx-auto grid h-20 w-20 place-items-center rounded-[1.6rem] text-white shadow-[0_16px_38px_rgba(255,0,125,0.24)] ${
        isSubscription ? "bg-[#1E3951]" : "bg-[#FF007D]"
      }`}
    >
      {isSubscription ? (
        <svg
          className="reload-choice-icon h-12 w-12"
          viewBox="0 0 80 80"
          aria-hidden="true"
        >
          <path
            d="M57 24a24 24 0 0 0-38 10"
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="7"
          />
          <path d="M58 11v18H40" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
          <path
            d="M23 56a24 24 0 0 0 38-10"
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="7"
          />
          <path d="M22 69V51h18" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
        </svg>
      ) : (
        <span className="text-5xl font-black leading-none">1</span>
      )}
    </div>
  );
}

export default function BookPage() {
  const { locale, setLocale, isRtl } = usePreferredLocale("en");
  const [step, setStep] = useState<Step>("choice");
  const [kind, setKind] = useState<ServiceKind | null>(null);
  const [serviceId, setServiceId] = useState("quick-wipe");
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>("salon");
  const [agreed, setAgreed] = useState(false);
  const [serviceDate, setServiceDate] = useState(() => formatISODateLocal(new Date()));
  const [slot, setSlot] = useState("15:00 - 16:00");
  const [customerName, setCustomerName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [zone, setZone] = useState<string>(SERVICE_LOCATIONS[0]);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [carDetails, setCarDetails] = useState("");
  const [note, setNote] = useState("");
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const activeServices = services.filter((service) => service.kind === "single");
  const subscriptionPlans = services.filter((service) => service.kind === "subscription");
  const selectedService = services.find((service) => service.id === serviceId);
  const slotOptions = useMemo(() => {
    const open = timeSlots.filter((item) => isSlotAvailable(item));
    return open.length > 0 ? open : timeSlots;
  }, []);
  const amount = useMemo(() => {
    if (kind === "subscription") {
      const sub = services.find((s) => s.id === serviceId && s.kind === "subscription");
      return sub?.price ?? 210;
    }
    return calculatePrice(serviceId, vehicleClass);
  }, [kind, serviceId, vehicleClass]);
  const promoResult = useMemo(
    () => calculatePromoDiscount(amount, appliedPromo),
    [amount, appliedPromo],
  );
  const finalAmount = Math.max(0, amount - promoResult.discount);
  const maxBookDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return formatISODateLocal(d);
  }, []);
  const derivedWeekday = weekdayValueFromISODate(serviceDate);
  const isDetailsValid =
    !!kind &&
    !!customerName.trim() &&
    !!plateNumber.trim() &&
    !!phone.trim() &&
    !!zone &&
    SERVICE_LOCATIONS.includes(zone as (typeof SERVICE_LOCATIONS)[number]) &&
    !!serviceDate &&
    /^\d{4}-\d{2}-\d{2}$/.test(serviceDate) &&
    !!slot;

  const stepIndex = bookingProgressIndex(step);

  function chooseKind(nextKind: ServiceKind) {
    setKind(nextKind);
    setPaid(false);

    if (nextKind === "single") {
      setServiceId("quick-wipe");
      setVehicleClass("salon");
      setStep("vehicle-type");
      return;
    }

    setServiceId("sub-4-row");
    setAgreed(false);
    setStep("subscription");
  }

  function goBack() {
    if (step === "choice") return;
    if (step === "vehicle-type" || step === "subscription") {
      setStep("choice");
      return;
    }
    if (step === "single-service") {
      setStep("vehicle-type");
      return;
    }
    setStep(kind === "subscription" ? "subscription" : "single-service");
  }

  async function completeBooking() {
    if (!isDetailsValid) return;
    setSubmitting(true);
    setPromoMessage("");

    try {
      const weekday = weekdayValueFromISODate(serviceDate);

      if (kind === "subscription") {
        const response = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: customerName.trim(),
            plateNumber: plateNumber.trim(),
            weekday,
            slot,
            zone,
            scheduledDate: serviceDate,
            planId: serviceId,
          }),
        });

        if (!response.ok) {
          setPromoMessage(bookCopy.errSubscription[locale]);
          return;
        }
      } else {
        const baseService =
          selectedService?.label.en ??
          services.find((service) => service.id === serviceId)?.label.en ??
          "Quick Wipe";
        const vehicleLabel = vehicleClass === "suv" ? "SUV" : "Salon";
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: customerName.trim(),
            plateNumber: plateNumber.trim(),
            service: `${baseService} · ${vehicleLabel}`,
            zone,
            day: weekday,
            slot,
            amount: finalAmount,
            kind: "single",
            scheduledDate: serviceDate,
          }),
        });

        if (!response.ok) {
          setPromoMessage(bookCopy.errOrder[locale]);
          return;
        }
      }

      setReceiptId(`WPR-${Date.now().toString().slice(-6)}`);
      setPaid(true);
    } catch {
      setPromoMessage(bookCopy.errGeneric[locale]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="booking-page mobile-fit-screen relative bg-[#f7f7f6] text-[#1E3951]"
    >
      <div className="absolute -left-36 top-20 h-72 w-[34rem] rotate-[-18deg] rounded-full bg-[#FF007D]/12 blur-3xl" />
      <div className="absolute -right-40 bottom-20 h-80 w-[40rem] rounded-full bg-[#449883]/14 blur-3xl" />
      <div className="wiper7-band wiper7-band-book absolute inset-x-0 bottom-0 z-0">
        <Image
          alt={bookCopy.altRibbon[locale]}
          className="h-full w-full object-cover"
          height={578}
          src="/pic_ref/wiper7.JPG"
          unoptimized
          width={1024}
        />
      </div>
      <header className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="block w-28 sm:w-36" aria-label={bookCopy.altHome[locale]}>
          <Image
            alt={bookCopy.altLogo[locale]}
            className="h-auto w-full"
            height={249}
            priority
            src="/wiperclear.png"
            width={521}
          />
        </Link>
        <div className="flex items-center gap-2">
          {step !== "choice" && (
            <button
              className="focus-ring rounded-full border border-[#1E3951]/15 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em]"
              onClick={goBack}
              type="button"
            >
              {bookCopy.back[locale]}
            </button>
          )}
          <button
            className="focus-ring rounded-full border border-[#1E3951]/15 bg-white px-4 py-2 text-xs font-bold"
            onClick={() => setLocale(toggleLocale(locale))}
            type="button"
          >
            {locale === "en" ? bookCopy.langSwitchToAr[locale] : bookCopy.langSwitchToEn[locale]}
          </button>
        </div>
      </header>

      <section className="mobile-fit-body relative z-10 mx-auto flex max-w-7xl flex-col px-4 sm:px-6">
        <div className="mx-auto mb-3 flex w-full max-w-md gap-2">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className={`h-2 flex-1 rounded-full ${
                item <= stepIndex ? "bg-[#FF007D]" : "bg-[#1E3951]/10"
              }`}
            />
          ))}
        </div>

        <div
          key={step}
          className="booking-slide mx-auto grid min-h-0 w-full max-w-6xl flex-1 self-stretch pb-8 pt-1"
        >
          {step === "choice" && (
            <section className="mobile-fit-step w-full text-center">
              <p className="text-xs font-black uppercase tracking-[0.38em] text-[#FF007D]">
                {bookCopy.choiceKicker[locale]}
              </p>
              <h1 className="mx-auto mt-2 max-w-3xl text-4xl font-black leading-none tracking-[-0.06em] sm:text-7xl">
                {bookCopy.choiceTitle[locale]}
              </h1>
              <div className="mobile-fit-grid mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:mt-12 sm:gap-6">
                <button
                  className="mobile-fit-card focus-ring rounded-[2rem] border border-[#1E3951]/10 bg-white p-4 shadow-[0_24px_70px_rgba(30,57,81,0.10)] transition hover:-translate-y-1 sm:p-8"
                  onClick={() => chooseKind("subscription")}
                  type="button"
                >
                  <ChoiceIcon type="subscription" />
                  <h2 className="mt-4 text-xl font-black sm:text-3xl">
                    {bookCopy.subscriptionCardTitle[locale]}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-[#1E3951]/58 sm:text-base">
                    {bookCopy.subscriptionCardBody[locale]}
                  </p>
                </button>
                <button
                  className="mobile-fit-card focus-ring rounded-[2rem] border border-[#1E3951]/10 bg-white p-4 shadow-[0_24px_70px_rgba(30,57,81,0.10)] transition hover:-translate-y-1 sm:p-8"
                  onClick={() => chooseKind("single")}
                  type="button"
                >
                  <ChoiceIcon type="single" />
                  <h2 className="mt-4 text-xl font-black sm:text-3xl">{bookCopy.oneTimeCardTitle[locale]}</h2>
                  <p className="mt-2 text-xs leading-5 text-[#1E3951]/58 sm:text-base">
                    {bookCopy.oneTimeCardBody[locale]}
                  </p>
                </button>
              </div>
            </section>
          )}

          {step === "vehicle-type" && (
            <section className="mobile-fit-step w-full">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.38em] text-[#FF007D]">
                  {bookCopy.vehicleKicker[locale]}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] sm:text-6xl">
                  {bookCopy.vehicleTitle[locale]}
                </h1>
              </div>
              <div className="mobile-fit-grid mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:mt-8 sm:gap-6">
                <button
                  type="button"
                  className="mobile-fit-card focus-ring rounded-[2rem] border border-[#1E3951]/10 bg-white p-5 text-center shadow-[0_24px_70px_rgba(30,57,81,0.10)] transition hover:-translate-y-1 sm:p-8"
                  onClick={() => {
                    setVehicleClass("salon");
                    setStep("single-service");
                  }}
                >
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.35rem] bg-[#FF007D] text-lg font-black text-white shadow-[0_14px_35px_rgba(255,0,125,0.22)] sm:h-20 sm:w-20 sm:text-xl">
                    SL
                  </div>
                  <h2 className="mt-4 text-xl font-black sm:text-3xl">{bookCopy.vehicleSalonTitle[locale]}</h2>
                  <p className="mt-2 text-xs leading-5 text-[#1E3951]/58 sm:text-base">
                    {bookCopy.vehicleSalonHint[locale]}
                  </p>
                </button>
                <button
                  type="button"
                  className="mobile-fit-card focus-ring rounded-[2rem] border border-[#1E3951]/10 bg-white p-5 text-center shadow-[0_24px_70px_rgba(30,57,81,0.10)] transition hover:-translate-y-1 sm:p-8"
                  onClick={() => {
                    setVehicleClass("suv");
                    setStep("single-service");
                  }}
                >
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.35rem] bg-[#1E3951] text-xs font-black tracking-[0.08em] text-white shadow-[0_14px_35px_rgba(30,57,81,0.22)] sm:h-20 sm:w-20 sm:text-sm">
                    SUV
                  </div>
                  <h2 className="mt-4 text-xl font-black sm:text-3xl">{bookCopy.vehicleSuvTitle[locale]}</h2>
                  <p className="mt-2 text-xs leading-5 text-[#1E3951]/58 sm:text-base">
                    {bookCopy.vehicleSuvHint[locale]}
                  </p>
                </button>
              </div>
            </section>
          )}

          {step === "single-service" && (
            <section className="mobile-fit-step w-full">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.38em] text-[#FF007D]">
                  {bookCopy.singleKicker[locale]}
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-7xl">
                  {bookCopy.singleTitle[locale]}
                </h1>
              </div>
              <div className="mobile-fit-grid mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-3 sm:mt-6">
                {activeServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setServiceId(service.id);
                      setStep("details");
                    }}
                    className={`mobile-fit-card focus-ring rounded-[1.6rem] border bg-white p-3 text-center shadow-[0_18px_46px_rgba(30,57,81,0.10)] transition hover:-translate-y-1 sm:p-4 ${
                      serviceId === service.id
                        ? "border-[#FF007D]"
                        : "border-[#1E3951]/10"
                    }`}
                  >
                    <ServiceIcon label={serviceCardAbbrev(service.id, locale)} />
                    <h3 className="mt-2 text-lg font-black text-[#1E3951] sm:text-xl">
                      {service.label[locale]}
                    </h3>
                    <p className="mt-1 hidden text-xs leading-5 text-[#1E3951]/58 lg:block">
                      {service.description[locale]}
                    </p>
                    <p className="mt-2 text-lg font-black text-[#FF007D] sm:text-xl">
                      {formatQar(priceForVehicleClass(service, vehicleClass), locale)}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === "subscription" && (
            <section className="mx-auto grid max-w-5xl items-center gap-4 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="hidden overflow-hidden rounded-[2.5rem] border border-[#1E3951]/10 bg-white p-4 shadow-[0_24px_70px_rgba(30,57,81,0.12)] sm:block">
                <Image
                  alt={bookCopy.altSubscriptionVisual[locale]}
                  className="rounded-[2rem]"
                  height={578}
                  src="/pic_ref/wiper3.JPG"
                  unoptimized
                  width={1024}
                />
              </div>
              <div className="rounded-[2rem] bg-white/90 p-5 text-center shadow-[0_24px_70px_rgba(30,57,81,0.10)] backdrop-blur sm:p-8 sm:text-start">
                <p className="text-xs font-black uppercase tracking-[0.38em] text-[#FF007D]">
                  {bookCopy.subscriptionKicker[locale]}
                </p>
                <h1 className="mt-2 text-3xl font-black leading-none tracking-[-0.06em] sm:text-6xl">
                  {bookCopy.pickPlanTitle[locale]}
                </h1>
                <p className="mt-3 text-sm font-black text-[#1E3951]/72 sm:text-base">
                  {bookCopy.subscriptionHeroTitle[locale]}
                </p>
                <div className="mx-auto mt-5 grid max-w-xl grid-cols-1 gap-3 sm:mx-0 sm:grid-cols-2">
                  {subscriptionPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setServiceId(plan.id)}
                      className={`focus-ring flex flex-col items-center rounded-[1.6rem] border bg-white p-4 text-center shadow-[0_14px_40px_rgba(30,57,81,0.08)] transition hover:-translate-y-0.5 sm:items-start sm:p-5 sm:text-start ${
                        serviceId === plan.id ? "border-[#FF007D]" : "border-[#1E3951]/10"
                      }`}
                    >
                      <ServiceIcon label={serviceCardAbbrev(plan.id, locale)} variant="dark" />
                      <span className="mt-3 text-lg font-black text-[#1E3951] sm:text-xl">
                        {plan.label[locale]}
                      </span>
                      <span className="mt-1 text-xs leading-5 text-[#1E3951]/58 sm:text-sm">
                        {plan.description[locale]}
                      </span>
                      <span className="mt-3 text-base font-black text-[#FF007D] sm:text-lg">
                        {formatQarRange(locale, plan.price, plan.priceMax ?? plan.price)}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-6 text-[#1E3951]/62 sm:text-lg sm:leading-8">
                  {bookCopy.subscriptionHeroBody[locale]}
                </p>
                <label className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f7f7f6] p-4 text-start text-sm font-bold">
                  <input
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    type="checkbox"
                  />
                  {bookCopy.subscriptionTerms[locale]}
                </label>
                <button
                  className="focus-ring mt-6 rounded-full bg-[#FF007D] px-8 py-4 text-sm font-black uppercase tracking-[0.22em] text-white disabled:opacity-40"
                  disabled={!agreed}
                  onClick={() => setStep("details")}
                  type="button"
                >
                  {bookCopy.continue[locale]}
                </button>
              </div>
            </section>
          )}

          {step === "details" && (
            <section className="mobile-fit-step w-full">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.38em] text-[#FF007D]">
                  {bookCopy.detailsKicker[locale]}
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-7xl">
                  {bookCopy.detailsTitle[locale]}
                </h1>
              </div>
              <div className="mobile-fit-grid mt-3 grid gap-2 lg:grid-cols-[1fr_360px]">
                <div className="mobile-fit-card rounded-[1.8rem] border border-[#1E3951]/10 bg-white p-3 shadow-[0_24px_70px_rgba(30,57,81,0.10)] sm:p-6">
                  <ServiceLocationModal
                    open={locationModalOpen}
                    locale={locale}
                    selected={zone}
                    onClose={() => setLocationModalOpen(false)}
                    onSelect={setZone}
                  />
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <input
                      className="focus-ring w-full rounded-2xl border-2 border-[#FF007D]/55 bg-[#f7f7f6] px-3 py-2.5 text-sm font-black text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder={bookCopy.placeholderName[locale]}
                      required
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                    />
                    <input
                      className="focus-ring w-full rounded-2xl border-2 border-[#FF007D]/55 bg-[#f7f7f6] px-3 py-2.5 text-sm font-black uppercase text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder={bookCopy.placeholderPlate[locale]}
                      required
                      value={plateNumber}
                      onChange={(event) => setPlateNumber(event.target.value.toUpperCase())}
                    />
                    <input
                      className="focus-ring col-span-2 w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder={bookCopy.placeholderPhone[locale]}
                      required
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                    <button
                      type="button"
                      className="focus-ring col-span-2 flex w-full items-center justify-between rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-left text-sm font-black text-[#1E3951] sm:px-4 sm:py-4"
                      onClick={() => setLocationModalOpen(true)}
                    >
                      <span className={zone ? "text-[#1E3951]" : "text-[#1E3951]/38"}>
                        {zone || bookCopy.chooseLocation[locale]}
                      </span>
                      <span className="text-xs font-black text-[#FF007D]" aria-hidden>
                        ▼
                      </span>
                    </button>
                    <input
                      className="focus-ring w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder={bookCopy.placeholderCarDetails[locale]}
                      value={carDetails}
                      onChange={(event) => setCarDetails(event.target.value)}
                    />
                    <input
                      className="focus-ring w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder={bookCopy.placeholderNote[locale]}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#1E3951]/45">
                        {bookCopy.serviceDate[locale]}
                      </label>
                      <input
                        type="date"
                        required
                        min={formatISODateLocal(new Date())}
                        max={maxBookDate}
                        className="focus-ring w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm font-bold sm:px-4 sm:py-4"
                        value={serviceDate}
                        onChange={(event) => setServiceDate(event.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#1E3951]/45">
                        {bookCopy.time[locale]}
                      </label>
                      <select
                        className="focus-ring w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm font-bold sm:px-4 sm:py-4"
                        required
                        value={slot}
                        onChange={(event) => setSlot(event.target.value)}
                      >
                        {slotOptions.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-2 grid gap-2 sm:mt-4 sm:grid-cols-[1fr_130px]">
                    <input
                      className="focus-ring rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm uppercase sm:px-4 sm:py-4"
                      placeholder={bookCopy.placeholderPromo[locale]}
                      value={promoInput}
                      onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                    />
                    <button
                      className="focus-ring rounded-2xl bg-[#1E3951] px-4 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-white"
                      onClick={() => {
                        const lookup = calculatePromoDiscount(amount, promoInput);
                        if (!lookup.promo) {
                          setAppliedPromo("");
                          setPromoMessage(bookCopy.promoInvalid[locale]);
                          return;
                        }
                        setAppliedPromo(lookup.promo.code);
                        setPromoMessage(
                          formatPromoAppliedMessage(
                            locale,
                            lookup.promo.code,
                            formatQar(lookup.discount, locale),
                          ),
                        );
                      }}
                      type="button"
                    >
                      {bookCopy.apply[locale]}
                    </button>
                  </div>
                  {promoMessage && (
                    <p className="mt-2 text-xs font-bold text-[#1E3951]/68">
                      {promoMessage}
                    </p>
                  )}
                </div>

                <aside className="rounded-[1.4rem] bg-[#1E3951] p-3 text-white shadow-[0_24px_70px_rgba(30,57,81,0.18)] sm:hidden">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/70">
                        {bookCopy.total[locale]}
                      </p>
                      <strong className="text-2xl text-[#FBF3A7]">{formatQar(finalAmount, locale)}</strong>
                    </div>
                    <button
                      type="button"
                      disabled={!isDetailsValid || submitting}
                      onClick={completeBooking}
                      className="focus-ring rounded-full bg-[#FF007D] px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {submitting ? bookCopy.processing[locale] : bookCopy.payNow[locale]}
                    </button>
                  </div>
                </aside>

                <aside className="hidden rounded-[1.8rem] bg-[#1E3951] p-4 text-white shadow-[0_24px_70px_rgba(30,57,81,0.18)] sm:block sm:p-6">
                  <h2 className="text-xl font-black sm:text-2xl">{bookCopy.payment[locale]}</h2>
                  <div className="mt-4 space-y-2 text-xs text-white/70 sm:mt-6 sm:space-y-4 sm:text-sm">
                    <div className="flex justify-between gap-4">
                      <span>{bookCopy.customer[locale]}</span>
                      <strong className="text-white">
                        {customerName || bookCopy.notSet[locale]}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>{bookCopy.plate[locale]}</span>
                      <strong className="text-white uppercase">
                        {plateNumber || bookCopy.notSet[locale]}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>{bookCopy.service[locale]}</span>
                      <strong className="text-end text-white">
                        {selectedService?.label[locale] ?? bookCopy.notSelected[locale]}
                        {kind === "single"
                          ? locale === "ar"
                            ? vehicleClass === "suv"
                              ? " · دفع رباعي"
                              : " · سيدان"
                            : vehicleClass === "suv"
                              ? " · SUV"
                              : " · Salon"
                          : ""}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>{bookCopy.zoneLabel[locale]}</span>
                      <strong className="text-white">{zone || bookCopy.notSet[locale]}</strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>{bookCopy.bookingDate[locale]}</span>
                      <strong className="text-white">{serviceDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{bookCopy.day[locale]}</span>
                      <strong className="text-white">
                        {weekdayOptions.find((item) => item.value === derivedWeekday)?.label[locale] ??
                          derivedWeekday}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{bookCopy.time[locale]}</span>
                      <strong className="text-white">{slot}</strong>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="mb-2 flex justify-between">
                        <span>{bookCopy.subtotal[locale]}</span>
                        <strong className="text-white">{formatQar(amount, locale)}</strong>
                      </div>
                      <div className="mb-2 flex justify-between">
                        <span>{bookCopy.promo[locale]}</span>
                        <strong className="text-[#FBF3A7]">
                          -{formatQar(promoResult.discount, locale)}
                        </strong>
                      </div>
                      <div className="flex items-end justify-between">
                        <span>{bookCopy.total[locale]}</span>
                        <strong className="text-3xl text-[#FBF3A7] sm:text-4xl">
                          {formatQar(finalAmount, locale)}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!isDetailsValid || submitting}
                    onClick={completeBooking}
                    className="focus-ring mt-7 w-full rounded-full bg-[#FF007D] px-6 py-4 text-sm font-black uppercase tracking-[0.24em] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitting ? bookCopy.processing[locale] : bookCopy.payNow[locale]}
                  </button>
                </aside>
              </div>
            </section>
          )}
        </div>

      </section>

      {paid && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1E3951]/45 p-6 backdrop-blur-sm">
          <div className="confirmation-pop w-full max-w-md rounded-[2.5rem] bg-white p-8 text-center shadow-[0_30px_90px_rgba(30,57,81,0.28)]">
            <div className="checkmark-draw mx-auto grid h-28 w-28 place-items-center rounded-full bg-[#FF007D]">
              <svg
                aria-hidden="true"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 64 64"
              >
                <path
                  d="M18 33.5 27.5 43 47 22"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-[-0.04em]">
              {bookCopy.orderPlaced[locale]}
            </h2>
            <p className="mt-3 leading-7 text-[#1E3951]/62">
              {formatBookReceiptBody(locale, receiptId)}
            </p>
            <Link
              className="focus-ring mt-7 inline-flex rounded-full bg-[#1E3951] px-7 py-4 text-sm font-black uppercase tracking-[0.2em] text-white"
              href="/"
            >
              {bookCopy.done[locale]}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
