import { ImageResponse } from "next/og";
import { BRAND_NAME, BRAND_PREFIX, SITE_NAME } from "@/lib/brand";

/**
 * Paylaşım görselinin kaynağı — Equinox'un gece zemini ve altın vurgusuyla.
 *
 * Bu dosya bilerek `src/app/` altında DEĞİL: orada dursaydı Next onu her
 * derlemede uzantısız bir rota (`out/opengraph-image`) olarak üretirdi ve
 * GitHub Pages içerik tipini uzantıdan belirlediği için görsel
 * `application/octet-stream` olarak sunulurdu — paylaşım önizlemeleri bunu
 * görsel saymaz. Bunun yerine üretilen PNG depoya statik dosya olarak
 * işlenir; `scripts/build-brand-images.sh` bunu yapar.
 *
 * Bu yüzden görselde model sayısı gibi veriyle birlikte değişen bir bilgi
 * yok: statik bir dosya, katalog her büyüdüğünde bayatlardı.
 *
 * Satori yalnızca flexbox'ı destekler: birden fazla çocuğu olan her kutuda
 * `display: flex` açıkça verilmelidir, ızgara düzeni yoktur.
 */

export const dynamic = "force-static";

export const alt = `${SITE_NAME} — Türkçe yapay zekâ modeli rehberi`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #070813 0%, #0c1020 48%, #090817 100%)",
          color: "#f7f4ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="88" height="88" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="16" fill="#0d1020" />
            <circle cx="25" cy="32" r="15" fill="#f6c66a" opacity="0.95" />
            <circle cx="39" cy="32" r="15" fill="#0d1020" />
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
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#f6c66a",
              }}
            >
              {BRAND_PREFIX}
            </div>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#f7f4ea" }}>
              {BRAND_NAME}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            Hangi yapay zekâ modeli işinize uygun?
          </div>
          <div style={{ fontSize: 30, color: "#a8adbf", maxWidth: 860 }}>
            Bağlam penceresi, fiyat ve yeteneklerine göre karşılaştırın.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 28,
            borderTop: "1px solid rgba(255, 255, 255, 0.14)",
            fontSize: 24,
            color: "#72798f",
          }}
        >
          <div style={{ display: "flex" }}>ai.sametbasbug.dev</div>
          <div style={{ display: "flex" }}>Türkçe yapay zekâ model rehberi</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
