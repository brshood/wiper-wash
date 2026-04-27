import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { HowItWorksFlashcards } from "@/components/HowItWorksFlashcards";
import { LogoMontage } from "@/components/LogoMontage";

const trustBadges = [
  "On-demand service",
  "Weekly subscriptions",
  "Professional staff",
  "Payment online",
];

const howSteps = [
  {
    title: "Choose Your Service",
    description: "Select one-time wash or monthly subscription.",
  },
  {
    title: "Enter Your Details",
    description: "Add your name, phone number, email, address, and notes.",
  },
  {
    title: "Pay Online",
    description: "Securely pay based on the package you choose.",
  },
  {
    title: "We Come to You",
    description: "WIPER staff arrive at your location and clean your car.",
  },
];

const subscriptionFields = [
  "Preferred weekly day",
  "Customer name",
  "Phone number",
  "Email",
  "Address",
  "Notes",
];

const benefits = [
  {
    title: "We Come to You",
    description: "No need to drive to a car wash.",
  },
  {
    title: "Fast Booking",
    description: "Choose your service and pay in minutes.",
  },
  {
    title: "Clean, Modern Experience",
    description: "A smooth digital flow from booking to payment.",
  },
  {
    title: "Reliable Weekly Cleaning",
    description: "Subscriptions create automatic weekly staff work orders.",
  },
  {
    title: "Premium Visual Identity",
    description:
      "Bold neon pink and navy branding inspired by the WIPER identity system.",
  },
];

const faqs = [
  {
    question: "Do I need to bring my car anywhere?",
    answer: "No. WIPER comes to your location.",
  },
  {
    question: "Can I book a one-time wash?",
    answer: "Yes. You can book a single service wash anytime.",
  },
  {
    question: "What services are available for single wash?",
    answer: "Outer wash, inner + outer wash, VIP wash, and polish options.",
  },
  {
    question: "Can I subscribe monthly?",
    answer:
      "Yes. The subscription gives you weekly inner + outer washes for one month.",
  },
  {
    question: "Can I choose the weekly day?",
    answer: "Yes. Customers should be able to select their preferred weekly service day.",
  },
  {
    question: "How does payment work?",
    answer: "Customers pay online after choosing their service.",
  },
];

function PrimaryCta({ children }: { children: string }) {
  return (
    <Link
      href="/book"
      className="focus-ring rounded-full bg-[#FF007D] px-5 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_20px_60px_rgba(255,0,125,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(255,0,125,0.42)] sm:px-7 sm:py-4 sm:text-sm sm:tracking-[0.2em]"
    >
      {children}
    </Link>
  );
}

function SecondaryCta({
  children,
  href,
  dark = false,
}: {
  children: string;
  href: string;
  dark?: boolean;
}) {
  return (
    <a
      href={href}
      className={`focus-ring rounded-full px-5 py-3 text-center text-xs font-black uppercase tracking-[0.16em] transition hover:-translate-y-0.5 sm:px-7 sm:py-4 sm:text-sm sm:tracking-[0.2em] ${
        dark
          ? "border border-white/18 bg-white/10 text-white"
          : "border border-[#1E3951]/15 bg-white text-[#1E3951]"
      }`}
    >
      {children}
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-12 max-w-3xl">
      {eyebrow && (
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#FF007D] sm:text-sm sm:tracking-[0.45em]">
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-4 text-3xl font-black tracking-[-0.05em] sm:text-5xl ${
          light ? "text-white" : "text-[#1E3951]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-7 sm:mt-5 sm:text-lg sm:leading-8 ${
            light ? "text-white/70" : "text-[#1E3951]/66"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function WiperWave({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const waveStyle: CSSProperties = {
    left: "50%",
    top: dark ? "58%" : "64%",
    width: "min(150rem, 180vw)",
    opacity: dark ? 0.16 : 0.085,
  };

  return (
    <div className={`wiper7-wave ${dark ? "wiper7-wave-dark" : ""} ${className}`}>
      <div className="wiper7-wave-piece" style={waveStyle}>
        <Image
          alt="WIPER wave extension"
          className="h-auto w-full object-cover"
          height={578}
          src="/api/reference/wiper7"
          unoptimized
          width={1024}
        />
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
      <Link href="/" className="block w-24 shrink-0 sm:w-40" aria-label="WIPER home">
        <Image
          alt="WIPER Arabic and English logo"
          className="h-auto w-full"
          height={249}
          priority
          src="/wiperclear.png"
          width={521}
        />
      </Link>
      <nav className="hidden items-center gap-7 text-sm font-bold text-[#1E3951]/72 lg:flex">
        <a href="#how">How it works</a>
        <a href="#subscription">Subscriptions</a>
        <a href="#faq">FAQ</a>
      </nav>
      <PrimaryCta>Book a Wash</PrimaryCta>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <WiperWave className="absolute inset-x-0 bottom-0 top-auto z-0 h-[24rem]" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-[26rem] bg-gradient-to-t from-white/10 via-white/62 to-white" />
      <div className="wiper-ribbons wiper-ribbons-hero absolute inset-0 z-0">
        <span className="ribbon ribbon-pink" />
        <span className="ribbon ribbon-navy" />
        <span className="ribbon ribbon-gold" />
        <span className="ribbon ribbon-teal" />
      </div>
      <div className="absolute -left-40 top-28 h-80 w-[42rem] rotate-[-16deg] rounded-full bg-[#FF007D]/8 blur-3xl" />
      <div className="absolute -right-48 top-6 h-96 w-[46rem] rotate-12 rounded-full bg-[#449883]/10 blur-3xl" />
      <Navbar />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-6 sm:gap-12 sm:px-8 sm:pb-20 sm:pt-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-28 lg:pt-16">
        <div className="scroll-art-card max-w-2xl rounded-[1.75rem] bg-white/90 p-5 shadow-[0_20px_60px_rgba(30,57,81,0.08)] backdrop-blur-md sm:rounded-[2.5rem] sm:p-8">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-[#FF007D] sm:mb-5 sm:text-sm sm:tracking-[0.45em]">
            Mobile car wash Qatar
          </p>
          <h1 className="text-4xl font-black leading-[0.96] tracking-[-0.06em] text-[#1E3951] sm:text-7xl lg:text-8xl">
            Mobile Car Wash at Your Doorstep
          </h1>
          <p className="mt-5 text-base leading-7 text-[#1E3951]/66 sm:mt-7 sm:text-xl sm:leading-9">
            Book a professional car wash anywhere in Qatar. Choose a one-time
            wash or subscribe for weekly cleaning.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4">
            <PrimaryCta>Book a Wash</PrimaryCta>
            <SecondaryCta href="#subscription">
              View Packages
            </SecondaryCta>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-3">
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="rounded-full border border-[#1E3951]/10 bg-[#f7f7f6] px-3 py-2 text-[0.68rem] font-black text-[#1E3951]/72 sm:px-4 sm:py-3 sm:text-sm"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-photo-stage relative mx-auto min-h-[24rem] w-full max-w-[28rem] sm:min-h-[39rem] sm:max-w-none">
          <div className="absolute -left-8 -top-6 z-0 h-32 w-32 rounded-full bg-[#FBF3A7] sm:-left-14 sm:-top-12 sm:h-44 sm:w-44" />
          <div className="absolute -right-4 bottom-16 z-0 h-24 w-24 rounded-full bg-[#449883]/80 sm:-right-8 sm:bottom-8 sm:h-28 sm:w-28" />
          <div className="absolute bottom-28 left-[16%] z-0 h-12 w-[70%] rounded-full bg-[#1E3951]/22 blur-2xl sm:bottom-16 sm:left-[8%] sm:h-20 sm:w-[86%]" />
          <div className="hero-van-card relative z-10 -mr-3 ml-auto w-[106%] sm:-mr-10 sm:w-[118%] lg:-mr-20">
            <div className="hero-van-image-entry">
              <Image
                alt="WIPER branded mobile car wash van"
                className="hero-van-image h-[22rem] w-full object-contain object-center drop-shadow-[0_30px_34px_rgba(30,57,81,0.22)] sm:h-[34rem] sm:drop-shadow-[0_38px_46px_rgba(30,57,81,0.24)]"
                height={1080}
                src="/api/reference/wipervan2?v=2"
                unoptimized
                width={1920}
              />
            </div>
          </div>
          <div className="absolute left-2 top-8 z-30 max-w-[11rem] rounded-full bg-[#FF007D] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_45px_rgba(255,0,125,0.28)] sm:left-2 sm:top-10 sm:max-w-none sm:px-5 sm:py-3 sm:text-xs sm:tracking-[0.18em]">
            Arrives at your address
          </div>
          <div className="absolute right-2 top-24 z-30 rounded-full border border-[#1E3951]/10 bg-white/92 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.12em] text-[#1E3951] shadow-[0_18px_45px_rgba(30,57,81,0.12)] backdrop-blur-md sm:right-0 sm:top-32 sm:px-5 sm:py-3 sm:text-xs sm:tracking-[0.18em]">
            Online payment
          </div>
          <div className="absolute bottom-20 right-4 z-30 rounded-full border border-[#1E3951]/10 bg-white/92 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.12em] text-[#1E3951] shadow-[0_18px_45px_rgba(30,57,81,0.12)] backdrop-blur-md sm:bottom-24 sm:right-6 sm:px-5 sm:py-3 sm:text-xs sm:tracking-[0.18em]">
            Weekly cleaning
          </div>
          <div className="hero-pack-card absolute bottom-8 left-3 z-20 w-28 overflow-hidden rounded-[1.5rem] border border-[#1E3951]/10 bg-white p-2 shadow-[0_24px_70px_rgba(30,57,81,0.16)] sm:bottom-0 sm:left-0 sm:w-64 sm:rounded-[2rem] sm:p-3">
            <Image
              alt="WIPER branded packaging mockup"
              className="rounded-[1rem] object-cover sm:rounded-[1.5rem]"
              height={578}
              src="/api/reference/wiper9"
              unoptimized
              width={1024}
            />
          </div>
          <div className="absolute bottom-4 left-6 z-20 rounded-[1.5rem] bg-[#1E3951] p-4 text-white shadow-2xl sm:-bottom-10 sm:left-8 sm:rounded-[2rem] sm:p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF007D] sm:text-sm sm:tracking-[0.3em]">
              Book WIPER
            </p>
            <p className="mt-1 text-2xl font-black sm:mt-2 sm:text-3xl">Book now</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how" className="how-flash-section relative bg-white py-20">
      <WiperWave className="absolute -right-20 top-0 z-0 h-[26rem] w-[120vw]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading eyebrow="How it works" title="Clean Car. Zero Hassle." />
        </div>
        <HowItWorksFlashcards steps={howSteps} />
      </div>
    </section>
  );
}

function SubscriptionSection() {
  return (
    <section
      id="subscription"
      className="relative overflow-hidden bg-[#1E3951] py-20 text-white"
    >
      <WiperWave dark className="absolute -left-40 bottom-0 z-0 h-[30rem] w-[130vw]" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
        <div>
          <SectionHeading
            eyebrow="Subscription"
            title="Weekly Car Wash Subscription"
            description="Subscribe once and get your car cleaned weekly for the entire month. Choose your preferred weekly service day, and WIPER will automatically generate work orders for staff every week."
            light
          />
          <div className="rounded-[2rem] border border-[#FF007D]/35 bg-[#FF007D]/12 p-6 text-lg font-black leading-8">
            Monthly subscriptions are currently available only for inner + outer wash.
          </div>
        </div>
        <div className="scroll-art-card rounded-[2.5rem] border border-white/12 bg-white/10 p-6 backdrop-blur-md">
          <div className="grid gap-3 sm:grid-cols-2">
            {subscriptionFields.map((field) => (
              <div
                key={field}
                className="rounded-2xl border border-white/10 bg-white px-4 py-4 text-sm font-black text-[#1E3951]"
              >
                {field}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <PrimaryCta>Subscribe Monthly</PrimaryCta>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyWiperSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Why WIPER"
          title="Built for Speed, Convenience, and Precision"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="scroll-art-card rounded-[2rem] border border-[#1E3951]/10 bg-[#f7f7f6] p-6"
            >
              <h3 className="text-xl font-black text-[#1E3951]">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#1E3951]/62">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionHeading eyebrow="FAQ" title="Questions? We've Got You." />
        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="scroll-art-card rounded-[2rem] border border-[#1E3951]/10 bg-[#f7f7f6] p-6"
            >
              <h3 className="text-xl font-black text-[#1E3951]">{faq.question}</h3>
              <p className="mt-3 leading-7 text-[#1E3951]/66">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-[#1E3951] px-6 py-20 text-center text-white sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#FF007D33,transparent_34%)]" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-[#FF007D]">
          Ready
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-[-0.05em]">
          Ready for a Cleaner Car?
        </h2>
        <p className="mt-5 text-xl leading-9 text-white/72">
          Book WIPER today and get your car washed wherever you are.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <PrimaryCta>Book Now</PrimaryCta>
          <SecondaryCta href="#subscription" dark>
            View Services
          </SecondaryCta>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#262626] px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="block w-32" aria-label="WIPER home">
          <Image
            alt="WIPER logo"
            className="h-auto w-full"
            height={249}
            src="/wiperclear.png"
            width={521}
          />
        </Link>
        <p className="text-sm font-bold text-white/58">
          Mobile car wash at your doorstep in Qatar.
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="landing-page min-h-screen overflow-x-hidden bg-[#f7f7f6] text-[#1E3951]">
      <LogoMontage />
      <HeroSection />
      <HowItWorksSection />
      <SubscriptionSection />
      <WhyWiperSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
