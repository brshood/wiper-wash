"use client";

import { useEffect, useRef, useState } from "react";

type HowStep = {
  title: string;
  description: string;
};

type HowItWorksFlashcardsProps = {
  steps: HowStep[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ProgressDots({
  steps,
  currentIndex,
}: {
  steps: HowStep[];
  currentIndex: number;
}) {
  return (
    <div className="how-flash-progress" aria-hidden="true">
      {steps.map((step, index) => (
        <span
          className={
            index === currentIndex
              ? "how-flash-progress-active bg-[#FF007D]"
              : "bg-[#1E3951]/15"
          }
          key={step.title}
        />
      ))}
    </div>
  );
}

export function HowItWorksFlashcards({ steps }: HowItWorksFlashcardsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    let frame = 0;

    function updateActiveCard() {
      const section = sectionRef.current;
      const preview = previewRef.current;
      if (!section || !preview) return;

      const rect = section.getBoundingClientRect();
      const previewRect = preview.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const previewCenter = previewRect.top + previewRect.height / 2;
      const isActive = previewCenter <= viewportCenter && rect.bottom >= viewportCenter;
      const scrollableDistance = Math.max(
        1,
        rect.height - previewRect.height - window.innerHeight * 0.5,
      );
      const progress = clamp((viewportCenter - previewCenter) / scrollableDistance, 0, 0.999);
      const nextIndex = Math.floor(progress * steps.length);

      setIsPinned(isActive);
      setActiveIndex(clamp(nextIndex, 0, steps.length - 1));
    }

    function requestUpdate() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveCard);
    }

    updateActiveCard();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [steps.length]);

  return (
    <div
      ref={sectionRef}
      className={`how-flash-stage ${isPinned ? "how-flash-stage-active" : ""}`}
    >
      <div ref={previewRef} className="how-flash-preview" aria-hidden={isPinned}>
        <div className="how-flash-preview-inner">
          <article className="how-flash-card how-flash-card-active">
            <div className="flex items-center justify-between gap-6">
              <span className="text-6xl font-black text-[#FF007D]">01</span>
              <span className="rounded-full bg-[#1E3951] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
                Step 1 of {steps.length}
              </span>
            </div>
            <h3 className="mt-8 text-4xl font-black tracking-[-0.04em] text-[#1E3951] sm:text-5xl">
              {steps[0]?.title}
            </h3>
            <p className="mt-5 text-lg leading-8 text-[#1E3951]/66 sm:text-xl sm:leading-9">
              {steps[0]?.description}
            </p>
          </article>
          <ProgressDots steps={steps} currentIndex={0} />
        </div>
      </div>
      <div className={`how-flash-pin ${isPinned ? "how-flash-pin-active" : ""}`}>
        <div className="how-flash-card-frame">
          {steps.map((step, index) => {
            const state =
              index === activeIndex
                ? "active"
                : index < activeIndex
                  ? "previous"
                  : "next";

            return (
              <article
                className={`how-flash-card how-flash-card-${state}`}
                key={step.title}
                aria-hidden={index !== activeIndex}
              >
                <div className="flex items-center justify-between gap-6">
                  <span className="text-6xl font-black text-[#FF007D]">
                    0{index + 1}
                  </span>
                  <span className="rounded-full bg-[#1E3951] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
                    Step {index + 1} of {steps.length}
                  </span>
                </div>
                <h3 className="mt-8 text-4xl font-black tracking-[-0.04em] text-[#1E3951] sm:text-5xl">
                  {step.title}
                </h3>
                <p className="mt-5 text-lg leading-8 text-[#1E3951]/66 sm:text-xl sm:leading-9">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
        <ProgressDots steps={steps} currentIndex={activeIndex} />
      </div>
    </div>
  );
}
