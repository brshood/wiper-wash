"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  availableDays,
  calculatePrice,
  calculatePromoDiscount,
  formatQar,
  isSlotAvailable,
  services,
  timeSlots,
  type Locale,
  type ServiceKind,
} from "@/lib/wiper";

type Step = "choice" | "single-service" | "subscription" | "polish" | "details";

const polishOptions = [
  "Inner",
  "Outer",
  "Inner + outer",
  "Frontal",
  "Engine",
  "Rings",
  "Windshield",
  "Single side glass",
];

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
  const [locale, setLocale] = useState<Locale>("en");
  const [step, setStep] = useState<Step>("choice");
  const [kind, setKind] = useState<ServiceKind | null>(null);
  const [serviceId, setServiceId] = useState("outer");
  const [polish, setPolish] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [day, setDay] = useState("Sunday");
  const [slot, setSlot] = useState("10:00 - 11:00");
  const [customerName, setCustomerName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [carDetails, setCarDetails] = useState("");
  const [note, setNote] = useState("");
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const activeServices = services.filter((service) => service.kind === "single");
  const selectedService = services.find((service) => service.id === serviceId);
  const amount = useMemo(
    () =>
      kind === "subscription"
        ? services.find((service) => service.id === "monthly")?.price ?? 0
        : calculatePrice(serviceId, polish.length),
    [kind, polish.length, serviceId],
  );
  const promoResult = useMemo(
    () => calculatePromoDiscount(amount, appliedPromo),
    [amount, appliedPromo],
  );
  const finalAmount = Math.max(0, amount - promoResult.discount);
  const isDetailsValid =
    !!kind &&
    !!customerName.trim() &&
    !!plateNumber.trim() &&
    !!phone.trim() &&
    !!email.trim() &&
    !!address.trim() &&
    !!day &&
    !!slot;

  const isRtl = locale === "ar";
  const stepIndex = ["choice", "single-service", "subscription", "polish", "details"].indexOf(step);

  function chooseKind(nextKind: ServiceKind) {
    setKind(nextKind);
    setPaid(false);

    if (nextKind === "single") {
      setServiceId("outer");
      setStep("single-service");
      return;
    }

    setServiceId("monthly");
    setStep("subscription");
  }

  function goBack() {
    if (step === "choice") return;
    if (step === "single-service" || step === "subscription") {
      setStep("choice");
      return;
    }
    if (step === "polish") {
      setStep("single-service");
      return;
    }
    setStep(kind === "subscription" ? "subscription" : serviceId === "polish" ? "polish" : "single-service");
  }

  async function completeBooking() {
    if (!isDetailsValid) return;
    setSubmitting(true);
    setPromoMessage("");

    try {
      const zone = address.trim() || "West Bay";

      if (kind === "subscription") {
        const response = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: customerName.trim(),
            plateNumber: plateNumber.trim(),
            weekday: day,
            slot,
            zone,
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to create subscription.");
        }
      } else {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: customerName.trim(),
            plateNumber: plateNumber.trim(),
            service:
              selectedService?.label.en ??
              services.find((service) => service.id === serviceId)?.label.en ??
              "Outer wash",
            zone,
            day,
            slot,
            amount: finalAmount,
            kind: "single",
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to create order.");
        }
      }

      setReceiptId(`WPR-${Date.now().toString().slice(-6)}`);
      setPaid(true);
    } catch (error) {
      setPromoMessage(
        error instanceof Error ? error.message : "Something went wrong while placing the booking.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="mobile-fit-screen relative bg-[#f7f7f6] text-[#1E3951]"
    >
      <div className="absolute -left-36 top-20 h-72 w-[34rem] rotate-[-18deg] rounded-full bg-[#FF007D]/12 blur-3xl" />
      <div className="absolute -right-40 bottom-20 h-80 w-[40rem] rounded-full bg-[#449883]/14 blur-3xl" />
      <div className="wiper7-band wiper7-band-book absolute inset-x-0 bottom-0 z-0">
        <Image
          alt="WIPER booking ribbon pattern"
          className="h-full w-full object-cover"
          height={578}
          src="/api/reference/wiper7"
          unoptimized
          width={1024}
        />
      </div>
      <header className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="block w-28 sm:w-36" aria-label="WIPER home">
          <Image
            alt="WIPER logo"
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
              Back
            </button>
          )}
          <button
            className="focus-ring rounded-full border border-[#1E3951]/15 bg-white px-4 py-2 text-xs font-bold"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            type="button"
          >
            {locale === "en" ? "AR" : "EN"}
          </button>
        </div>
      </header>

      <section className="mobile-fit-body relative z-10 mx-auto flex max-w-7xl flex-col px-4 sm:px-6">
        <div className="mx-auto mb-3 flex w-full max-w-md gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-2 flex-1 rounded-full ${
                item <= Math.min(stepIndex, 3) ? "bg-[#FF007D]" : "bg-[#1E3951]/10"
              }`}
            />
          ))}
        </div>

        <div
          key={step}
          className="booking-slide mx-auto grid min-h-0 w-full max-w-6xl flex-1 place-items-center"
        >
          {step === "choice" && (
            <section className="mobile-fit-step w-full text-center">
              <p className="text-xs font-black uppercase tracking-[0.38em] text-[#FF007D]">
                Get washed
              </p>
              <h1 className="mx-auto mt-2 max-w-3xl text-4xl font-black leading-none tracking-[-0.06em] sm:text-7xl">
                What kind of wash do you need?
              </h1>
              <div className="mobile-fit-grid mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:mt-12 sm:gap-6">
                <button
                  className="mobile-fit-card focus-ring rounded-[2rem] border border-[#1E3951]/10 bg-white p-4 shadow-[0_24px_70px_rgba(30,57,81,0.10)] transition hover:-translate-y-1 sm:p-8"
                  onClick={() => chooseKind("subscription")}
                  type="button"
                >
                  <ChoiceIcon type="subscription" />
                  <h2 className="mt-4 text-xl font-black sm:text-3xl">Subscription</h2>
                  <p className="mt-2 text-xs leading-5 text-[#1E3951]/58 sm:text-base">
                    Weekly wash, same selected day, monthly payment.
                  </p>
                </button>
                <button
                  className="mobile-fit-card focus-ring rounded-[2rem] border border-[#1E3951]/10 bg-white p-4 shadow-[0_24px_70px_rgba(30,57,81,0.10)] transition hover:-translate-y-1 sm:p-8"
                  onClick={() => chooseKind("single")}
                  type="button"
                >
                  <ChoiceIcon type="single" />
                  <h2 className="mt-4 text-xl font-black sm:text-3xl">One time</h2>
                  <p className="mt-2 text-xs leading-5 text-[#1E3951]/58 sm:text-base">
                    Pick the service you want today and pay once.
                  </p>
                </button>
              </div>
            </section>
          )}

          {step === "single-service" && (
            <section className="mobile-fit-step w-full">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.38em] text-[#FF007D]">
                  One time service
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-7xl">
                  Choose your service.
                </h1>
              </div>
              <div className="mobile-fit-grid mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-3 sm:mt-6">
                {activeServices.map((service) => {
                  const icon =
                    service.id === "outer"
                      ? "OUT"
                      : service.id === "inner-outer"
                        ? "IN"
                        : service.id === "vip"
                          ? "VIP"
                          : "POL";

                  return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setServiceId(service.id);
                      setStep(service.id === "polish" ? "polish" : "details");
                    }}
                    className={`mobile-fit-card focus-ring rounded-[1.6rem] border bg-white p-3 text-center shadow-[0_18px_46px_rgba(30,57,81,0.10)] transition hover:-translate-y-1 sm:p-4 ${
                      serviceId === service.id
                        ? "border-[#FF007D]"
                        : "border-[#1E3951]/10"
                    }`}
                  >
                    <ServiceIcon label={icon} />
                    <h3 className="mt-2 text-lg font-black text-[#1E3951] sm:text-xl">
                      {service.label[locale]}
                    </h3>
                    <p className="mt-1 hidden text-xs leading-5 text-[#1E3951]/58 lg:block">
                      {service.description[locale]}
                    </p>
                    <p className="mt-2 text-lg font-black text-[#FF007D] sm:text-xl">
                      {formatQar(service.price)}
                    </p>
                  </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === "polish" && (
            <section className="w-full text-center">
              <p className="text-xs font-black uppercase tracking-[0.38em] text-[#FF007D]">
                Polish
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-7xl">
                What type?
              </h1>
              <div className="mx-auto mt-5 grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {polishOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex min-h-16 items-center gap-2 rounded-2xl border p-3 text-left text-xs font-black sm:min-h-24 sm:text-sm ${
                      polish.includes(option)
                        ? "border-[#FF007D] bg-[#FF007D]/10"
                        : "border-[#1E3951]/10 bg-white"
                    }`}
                  >
                    <input
                      checked={polish.includes(option)}
                      onChange={(event) =>
                        setPolish((items) =>
                          event.target.checked
                            ? [...items, option]
                            : items.filter((item) => item !== option),
                        )
                      }
                      type="checkbox"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <button
                className="focus-ring mt-5 rounded-full bg-[#FF007D] px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white disabled:opacity-40"
                disabled={polish.length === 0}
                onClick={() => setStep("details")}
                type="button"
              >
                Continue
              </button>
            </section>
          )}

          {step === "subscription" && (
            <section className="mx-auto grid max-w-5xl items-center gap-4 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="hidden overflow-hidden rounded-[2.5rem] border border-[#1E3951]/10 bg-white p-4 shadow-[0_24px_70px_rgba(30,57,81,0.12)] sm:block">
                <Image
                  alt="WIPER logo on navy background"
                  className="rounded-[2rem]"
                  height={578}
                  src="/api/reference/wiper3"
                  unoptimized
                  width={1024}
                />
              </div>
              <div className="rounded-[2rem] bg-white/90 p-5 text-center shadow-[0_24px_70px_rgba(30,57,81,0.10)] backdrop-blur sm:p-8 sm:text-left">
                <ServiceIcon label="SUB" variant="dark" />
                <p className="mt-5 text-xs font-black uppercase tracking-[0.38em] text-[#FF007D]">
                  Subscription
                </p>
                <h1 className="mt-2 text-4xl font-black leading-none tracking-[-0.06em] sm:text-7xl">
                  Weekly inner and outer wash.
                </h1>
                <p className="mt-4 text-sm leading-6 text-[#1E3951]/62 sm:text-lg sm:leading-8">
                  Subscription is limited to inner and outer washes. You pay
                  once per month, choose a weekly day and time window, and WIPER
                  creates recurring work orders for the staff.
                </p>
                <label className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f7f7f6] p-4 text-left text-sm font-bold">
                  <input
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    type="checkbox"
                  />
                  I agree to the monthly subscription terms.
                </label>
                <button
                  className="focus-ring mt-6 rounded-full bg-[#FF007D] px-8 py-4 text-sm font-black uppercase tracking-[0.22em] text-white disabled:opacity-40"
                  disabled={!agreed}
                  onClick={() => setStep("details")}
                  type="button"
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {step === "details" && (
            <section className="mobile-fit-step w-full">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.38em] text-[#FF007D]">
                  Final step
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-7xl">
                  Info, schedule, payment.
                </h1>
              </div>
              <div className="mobile-fit-grid mt-3 grid gap-2 lg:grid-cols-[1fr_360px]">
                <div className="mobile-fit-card rounded-[1.8rem] border border-[#1E3951]/10 bg-white p-3 shadow-[0_24px_70px_rgba(30,57,81,0.10)] sm:p-6">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <input
                      className="focus-ring w-full rounded-2xl border-2 border-[#FF007D]/55 bg-[#f7f7f6] px-3 py-2.5 text-sm font-black text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder="Customer name *"
                      required
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                    />
                    <input
                      className="focus-ring w-full rounded-2xl border-2 border-[#FF007D]/55 bg-[#f7f7f6] px-3 py-2.5 text-sm font-black uppercase text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder="Car plate number *"
                      required
                      value={plateNumber}
                      onChange={(event) => setPlateNumber(event.target.value.toUpperCase())}
                    />
                    <input
                      className="focus-ring w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder="Phone *"
                      required
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                    <input
                      className="focus-ring w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder="Email *"
                      required
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <input
                      className="focus-ring w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder="Address *"
                      required
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                    />
                    <input
                      className="focus-ring w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder="Car details"
                      value={carDetails}
                      onChange={(event) => setCarDetails(event.target.value)}
                    />
                    <input
                      className="focus-ring col-span-2 w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm text-[#1E3951] placeholder:text-[#1E3951]/38 sm:px-4 sm:py-4"
                      placeholder="Note"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-[220px_1fr] sm:gap-4">
                    <select
                      className="focus-ring rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm sm:px-4 sm:py-4"
                      required
                      value={day}
                      onChange={(event) => setDay(event.target.value)}
                    >
                      {availableDays.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    <select
                      className="focus-ring rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm sm:px-4 sm:py-4"
                      required
                      value={slot}
                      onChange={(event) => setSlot(event.target.value)}
                    >
                      {timeSlots
                        .filter((item) => isSlotAvailable(item))
                        .map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                    </select>
                  </div>
                  <div className="mt-2 grid gap-2 sm:mt-4 sm:grid-cols-[1fr_130px]">
                    <input
                      className="focus-ring rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2.5 text-sm uppercase sm:px-4 sm:py-4"
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                    />
                    <button
                      className="focus-ring rounded-2xl bg-[#1E3951] px-4 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-white"
                      onClick={() => {
                        const lookup = calculatePromoDiscount(amount, promoInput);
                        if (!lookup.promo) {
                          setAppliedPromo("");
                          setPromoMessage("Promo code not valid.");
                          return;
                        }
                        setAppliedPromo(lookup.promo.code);
                        setPromoMessage(
                          `${lookup.promo.code} applied: -${formatQar(lookup.discount)}`,
                        );
                      }}
                      type="button"
                    >
                      Apply
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
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/70">Total</p>
                      <strong className="text-2xl text-[#FBF3A7]">{formatQar(finalAmount)}</strong>
                    </div>
                    <button
                      type="button"
                      disabled={!isDetailsValid || submitting}
                      onClick={completeBooking}
                      className="focus-ring rounded-full bg-[#FF007D] px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {submitting ? "Processing..." : "Pay now"}
                    </button>
                  </div>
                </aside>

                <aside className="hidden rounded-[1.8rem] bg-[#1E3951] p-4 text-white shadow-[0_24px_70px_rgba(30,57,81,0.18)] sm:block sm:p-6">
                  <h2 className="text-xl font-black sm:text-2xl">Payment</h2>
                  <div className="mt-4 space-y-2 text-xs text-white/70 sm:mt-6 sm:space-y-4 sm:text-sm">
                    <div className="flex justify-between gap-4">
                      <span>Customer</span>
                      <strong className="text-white">
                        {customerName || "Not set"}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Plate</span>
                      <strong className="text-white uppercase">
                        {plateNumber || "Not set"}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Service</span>
                      <strong className="text-white">
                        {kind === "subscription"
                          ? services.find((service) => service.id === "monthly")
                              ?.label[locale]
                          : selectedService?.label[locale] ?? "Not selected"}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Day</span>
                      <strong className="text-white">{day}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Time</span>
                      <strong className="text-white">{slot}</strong>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="mb-2 flex justify-between">
                        <span>Subtotal</span>
                        <strong className="text-white">{formatQar(amount)}</strong>
                      </div>
                      <div className="mb-2 flex justify-between">
                        <span>Promo</span>
                        <strong className="text-[#FBF3A7]">
                          -{formatQar(promoResult.discount)}
                        </strong>
                      </div>
                      <div className="flex items-end justify-between">
                        <span>Total</span>
                        <strong className="text-3xl text-[#FBF3A7] sm:text-4xl">
                          {formatQar(finalAmount)}
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
                    {submitting ? "Processing..." : "Pay now"}
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
              Order placed
            </h2>
            <p className="mt-3 leading-7 text-[#1E3951]/62">
              Receipt {receiptId} has been created. Confirmation details were
              sent to the email and number on file.
            </p>
            <Link
              className="focus-ring mt-7 inline-flex rounded-full bg-[#1E3951] px-7 py-4 text-sm font-black uppercase tracking-[0.2em] text-white"
              href="/"
            >
              Done
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
