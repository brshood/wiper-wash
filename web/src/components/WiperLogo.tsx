type WiperLogoProps = {
  compact?: boolean;
  tone?: "light" | "dark";
};

export function WiperLogo({ compact = false, tone = "light" }: WiperLogoProps) {
  const textColor = tone === "dark" ? "text-[#1E3951]" : "text-white";

  return (
    <div className="inline-flex items-center gap-3" aria-label="WIPER logo">
      <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-white/20 bg-[#1E3951] shadow-[0_0_34px_rgba(255,0,125,0.45)]">
        <div className="absolute h-20 w-3 rotate-45 bg-[#FF007D]" />
        <div className="absolute bottom-2 h-1 w-8 rounded-full bg-white/80" />
      </div>
      {!compact && (
        <div>
          <div className={`text-2xl font-black tracking-[0.34em] ${textColor}`}>
            WIPER
          </div>
          <div className="text-xs uppercase tracking-[0.45em] text-[#FF007D]">
            Qatar
          </div>
        </div>
      )}
    </div>
  );
}
