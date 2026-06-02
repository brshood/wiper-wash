"use client";

import Link from "next/link";
import {
  formatQarRange,
  services,
  type Locale,
  type ServiceOption,
} from "@/lib/wiper";

type PackagesModalProps = {
  open: boolean;
  locale: Locale;
  onClose: () => void;
};

function PackageCard({
  service,
  locale,
  onClose,
}: {
  service: ServiceOption;
  locale: Locale;
  onClose: () => void;
}) {
  const isSubscription = service.kind === "subscription";

  return (
    <article
      className={`flex flex-col rounded-[1.5rem] border p-5 ${
        isSubscription
          ? "border-[#FF007D]/35 bg-[#FF007D]/8"
          : "border-[#1E3951]/10 bg-[#f7f7f6]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-black text-[#1E3951]">{service.label[locale]}</h3>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] ${
            isSubscription ? "bg-[#FF007D] text-white" : "bg-[#1E3951]/10 text-[#1E3951]/72"
          }`}
        >
          {isSubscription
            ? locale === "ar"
              ? "اشتراك"
              : "Subscription"
            : locale === "ar"
              ? "مرة واحدة"
              : "One-time"}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm leading-6 text-[#1E3951]/66">{service.description[locale]}</p>
      <p className="mt-4 text-xl font-black text-[#FF007D]">
        {formatQarRange(locale, service.price, service.priceMax ?? service.price)}
      </p>
      <Link
        href="/book"
        onClick={onClose}
        className="focus-ring mt-4 inline-block rounded-full bg-[#1E3951] px-5 py-2.5 text-center text-xs font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5"
      >
        {locale === "ar" ? "احجز" : "Book"}
      </Link>
    </article>
  );
}

export function PackagesModal({ open, locale, onClose }: PackagesModalProps) {
  if (!open) return null;

  const singleServices = services.filter((s) => s.kind === "single");
  const subscriptionServices = services.filter((s) => s.kind === "subscription");

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#1E3951]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="packages-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_90px_rgba(30,57,81,0.32)] sm:rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#1E3951]/10 px-5 py-4">
          <h2 id="packages-modal-title" className="text-lg font-black text-[#1E3951]">
            {locale === "ar" ? "باقات WIPER" : "WIPER packages"}
          </h2>
          <button
            type="button"
            className="focus-ring rounded-full border border-[#1E3951]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#1E3951]"
            onClick={onClose}
          >
            {locale === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <p className="text-sm leading-6 text-[#1E3951]/62">
            {locale === "ar"
              ? "اختر غسيلاً لمرة واحدة أو اشترك للتنظيف الأسبوعي. الأسعار بالريال القطري."
              : "Pick a one-time wash or subscribe for weekly cleaning. Prices in QAR."}
          </p>

          <h3 className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-[#FF007D]">
            {locale === "ar" ? "لمرة واحدة" : "One-time"}
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-1">
            {singleServices.map((service) => (
              <PackageCard key={service.id} service={service} locale={locale} onClose={onClose} />
            ))}
          </div>

          <h3 className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-[#FF007D]">
            {locale === "ar" ? "اشتراكات" : "Subscriptions"}
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {subscriptionServices.map((service) => (
              <PackageCard key={service.id} service={service} locale={locale} onClose={onClose} />
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-[#1E3951]/10 px-5 py-4">
          <Link
            href="/book"
            onClick={onClose}
            className="focus-ring block w-full rounded-full bg-[#FF007D] px-6 py-3.5 text-center text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_16px_48px_rgba(255,0,125,0.28)] transition hover:-translate-y-0.5"
          >
            {locale === "ar" ? "ابدأ الحجز" : "Start booking"}
          </Link>
        </div>
      </div>
    </div>
  );
}
