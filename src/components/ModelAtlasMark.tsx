import { useId } from "react";

/**
 * Model Atlası ürün işareti.
 *
 * Equinox ana işaretini yeniden renklendirmez: ağdaki her ürün kendi sembolünü
 * taşır. Orbit'in yörünge işareti gibi Model Atlası da karşılaştırma/veri
 * sütunlarını kullanır. Gül yüzey ürünün tonudur; altın yörünge ve düğüm ise
 * Equinox ailesiyle bağı kurar.
 *
 * Favicon aynı fikrin küçük ölçekte sadeleştirilmiş biçimidir (`app/icon.svg`):
 * 16–32 pikselde kaybolacak yörünge ve parıltı orada bilerek yoktur.
 */
export function ModelAtlasMark({ className }: { className?: string }) {
  const gradientId = useId();
  const glowId = useId();

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="7"
          y1="5"
          x2="58"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#861a32" />
          <stop offset="0.52" stopColor="#b62243" />
          <stop offset="1" stopColor="#dc6478" />
        </linearGradient>
        <radialGradient
          id={glowId}
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(48 13) rotate(132) scale(25)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f6c66a" stopOpacity="0.72" />
          <stop offset="1" stopColor="#f6c66a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#${gradientId})`} />
      <rect
        x="2.75"
        y="2.75"
        width="58.5"
        height="58.5"
        rx="15.25"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />
      <circle cx="47" cy="15" r="22" fill={`url(#${glowId})`} />

      {/* Hem yükselen veri çizgisi hem de Equinox yörüngesi. */}
      <path
        d="M13 39C23 20 39 13 53 23"
        fill="none"
        stroke="#f6c66a"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.82"
      />
      <circle cx="53" cy="23" r="3.2" fill="#fff4d3" />

      {/* Hub'daki Model Atlası kartından gelen karşılaştırma/veri sütunları. */}
      <g
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 48h37" strokeWidth="3.2" opacity="0.94" />
      </g>
      <rect x="20" y="34" width="6" height="14" rx="3" fill="#fff" />
      <rect x="30" y="26" width="6" height="22" rx="3" fill="#fff" />
      <rect x="40" y="17" width="6" height="31" rx="3" fill="#fff" />
    </svg>
  );
}
