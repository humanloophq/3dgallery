import { useId } from "react";
import type { Finish } from "@/lib/product";
import { getFinish, type FinishId } from "@/lib/product";

interface ProductVisualProps {
  finish?: Finish | FinishId;
  className?: string;
  detail?: boolean;
}

export function ProductVisual({
  finish = "graphite",
  className = "",
  detail = true,
}: ProductVisualProps) {
  const resolved = typeof finish === "string" ? getFinish(finish) : finish;
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const metal = `metal-${uid}`;
  const dark = `dark-${uid}`;
  const accent = `accent-${uid}`;
  const glow = `glow-${uid}`;
  const blur = `blur-${uid}`;

  const light =
    resolved.id === "titanium" ? "#ffffff" : resolved.id === "cosmic" ? "#b9a2ff" : "#9c9cad";
  const deep =
    resolved.id === "graphite" ? "#0b0b0f" : resolved.id === "cosmic" ? "#150e2b" : "#3a3a46";

  return (
    <svg
      viewBox="0 0 480 480"
      role="img"
      aria-label={`AURA ONE headphones in ${resolved.name}`}
      className={className}
      style={
        {
          "--metal-light": light,
          "--metal-mid": resolved.hex,
          "--metal-dark": deep,
          "--accent": resolved.accent,
        } as React.CSSProperties
      }
    >
      <defs>
        <linearGradient id={metal} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="var(--metal-light)" />
          <stop offset="26%" stopColor="var(--metal-mid)" />
          <stop offset="58%" stopColor="var(--metal-mid)" />
          <stop offset="82%" stopColor="var(--metal-dark)" />
          <stop offset="100%" stopColor="var(--metal-dark)" />
        </linearGradient>
        <linearGradient id={dark} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#2c2c36" />
          <stop offset="55%" stopColor="#121218" />
          <stop offset="100%" stopColor="#07070a" />
        </linearGradient>
        <linearGradient id={accent} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.26" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <filter id={blur} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <ellipse cx="240" cy="238" rx="216" ry="196" fill={`url(#${glow})`} />
      <ellipse
        cx="240"
        cy="430"
        rx="138"
        ry="14"
        fill="#000"
        opacity="0.62"
        filter={`url(#${blur})`}
      />

      {/* headband */}
      <path
        d="M118 302 C118 108 362 108 362 302"
        fill="none"
        stroke={`url(#${metal})`}
        strokeWidth="31"
        strokeLinecap="round"
      />
      <path
        d="M118 302 C118 108 362 108 362 302"
        fill="none"
        stroke="#000"
        strokeOpacity="0.22"
        strokeWidth="31"
        strokeLinecap="round"
        transform="translate(0 3)"
        opacity="0.5"
      />
      <path
        d="M118 302 C118 108 362 108 362 302"
        fill="none"
        stroke={`url(#${metal})`}
        strokeWidth="30"
        strokeLinecap="round"
      />
      <path
        d="M126 296 C128 150 352 150 354 296"
        fill="none"
        stroke="#0d0d12"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {detail && (
        <>
          <path
            d="M124 292 C126 124 354 124 356 292"
            fill="none"
            stroke="#fff"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.2"
          />
          <path
            d="M202 124 C222 114 258 114 278 124"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </>
      )}

      {/* yokes */}
      <g>
        <rect x="103" y="266" width="31" height="104" rx="15.5" fill={`url(#${metal})`} />
        <rect x="346" y="266" width="31" height="104" rx="15.5" fill={`url(#${metal})`} />
        <rect x="109" y="278" width="4" height="78" rx="2" fill="#fff" opacity="0.16" />
        <rect x="352" y="278" width="4" height="78" rx="2" fill="#fff" opacity="0.16" />
      </g>

      {/* left earcup */}
      <g>
        <rect x="44" y="300" width="136" height="156" rx="66" fill={`url(#${metal})`} />
        <rect
          x="44"
          y="300"
          width="136"
          height="156"
          rx="66"
          fill="none"
          stroke="#000"
          strokeOpacity="0.35"
        />
        <rect
          x="49"
          y="305"
          width="126"
          height="146"
          rx="61"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.16"
        />
        <path
          d="M60 336 C74 312 96 304 118 306"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.25"
        />
        <ellipse cx="112" cy="378" rx="47" ry="65" fill={`url(#${dark})`} />
        <ellipse
          cx="112"
          cy="378"
          rx="47"
          ry="65"
          fill="none"
          stroke="#000"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
        <ellipse
          cx="112"
          cy="378"
          rx="34"
          ry="49"
          fill="none"
          stroke={`url(#${accent})`}
          strokeWidth="1.6"
        />
        <ellipse
          cx="112"
          cy="378"
          rx="22"
          ry="33"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
        <circle cx="112" cy="378" r="6.5" fill="var(--accent)" opacity="0.9" />
        <circle cx="112" cy="378" r="13" fill="var(--accent)" opacity="0.14" />
      </g>

      {/* right earcup */}
      <g>
        <rect x="300" y="300" width="136" height="156" rx="66" fill={`url(#${metal})`} />
        <rect
          x="300"
          y="300"
          width="136"
          height="156"
          rx="66"
          fill="none"
          stroke="#000"
          strokeOpacity="0.35"
        />
        <rect
          x="305"
          y="305"
          width="126"
          height="146"
          rx="61"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.16"
        />
        <path
          d="M316 336 C330 312 352 304 374 306"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.25"
        />
        <ellipse cx="368" cy="378" rx="47" ry="65" fill={`url(#${dark})`} />
        <ellipse
          cx="368"
          cy="378"
          rx="47"
          ry="65"
          fill="none"
          stroke="#000"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
        <ellipse
          cx="368"
          cy="378"
          rx="34"
          ry="49"
          fill="none"
          stroke={`url(#${accent})`}
          strokeWidth="1.6"
        />
        <ellipse
          cx="368"
          cy="378"
          rx="22"
          ry="33"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
        <circle cx="368" cy="378" r="6.5" fill="var(--accent)" opacity="0.9" />
        <circle cx="368" cy="378" r="13" fill="var(--accent)" opacity="0.14" />
      </g>
    </svg>
  );
}
