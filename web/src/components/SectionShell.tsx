import type { ReactNode } from "react";

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
}: SectionShellProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
      <div className="mb-10 max-w-3xl">
        {eyebrow && (
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.4em] text-[#FF007D]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-lg leading-8 text-white/68">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
