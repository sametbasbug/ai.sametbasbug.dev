import { ImageResponse } from "next/og";

/**
 * iOS ana ekran simgesi. Köşe yuvarlamayı sistem kendi uyguladığı için
 * işaretin kendi `rect`'i çizilmez; gece zemini kutuyu taştan taşa doldurur.
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
          background: "#080914",
        }}
      >
        <svg width="140" height="140" viewBox="8 8 48 48">
          <circle cx="25" cy="32" r="15" fill="#f6c66a" opacity="0.95" />
          <circle cx="39" cy="32" r="15" fill="#080914" />
          <path
            d="M11 34c12-12 30-12 42 0"
            fill="none"
            stroke="#73d7ff"
            strokeWidth="2"
            opacity="0.65"
          />
          <path
            d="M12 30c12 12 28 12 40 0"
            fill="none"
            stroke="#f2637a"
            strokeWidth="2"
            opacity="0.55"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
