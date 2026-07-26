import { ImageResponse } from "next/og";

/**
 * iOS ana ekran simgesi. Tarayıcı favicon'undan daha büyük çizildiği için ürün
 * logosundaki yörüngeyi korur; köşe yuvarlamayı sistem kendi uygular.
 */

// Görsel rotaları da birer rota işleyicisidir; `output: "export"` altında
// derleme zamanında üretilecekleri açıkça belirtilmeli (bkz. sitemap.ts).
export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #861a32 0%, #b62243 52%, #dc6478 100%)",
        }}
      >
        <svg width="144" height="144" viewBox="0 0 64 64">
          <path
            d="M13 39C23 20 39 13 53 23"
            fill="none"
            stroke="#f6c66a"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.82"
          />
          <circle cx="53" cy="23" r="3.2" fill="#fff4d3" />
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
      </div>
    ),
    { ...size },
  );
}
