import Link from "next/link";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  compact?: boolean;
}

export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="16"
        cy="16"
        r="13.25"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.9"
      />
      <path
        d="M10.2 21.6 16 9.2l5.8 12.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.6 17.9h6.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="16" cy="16" r="1.55" fill="#8B5CF6" />
    </svg>
  );
}

export function Logo({ className = "", showWordmark = true }: LogoProps) {
  return (
    <Link
      href="#top"
      aria-label="AURA Audio — return to top"
      className={`group inline-flex items-center gap-3 text-chalk ${className}`}
    >
      <span className="relative grid h-9 w-9 place-items-center">
        <span className="absolute inset-0 rounded-full bg-violet/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
        <LogoMark className="relative h-8 w-8 transition-transform duration-700 ease-luxury group-hover:rotate-90" />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-medium tracking-[0.24em]">
            AURA
          </span>
          <span className="mt-1 text-[0.5rem] tracking-[0.34em] text-silver/45">
            AUDIO
          </span>
        </span>
      )}
    </Link>
  );
}
