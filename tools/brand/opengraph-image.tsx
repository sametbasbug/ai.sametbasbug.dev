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
            <defs>
              <linearGradient
                id="atlas-surface"
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
            </defs>
            <rect
              x="2"
              y="2"
              width="60"
              height="60"
              rx="16"
              fill="url(#atlas-surface)"
            />
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
