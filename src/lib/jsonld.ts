import type { Model, Provider } from "@/data/types";
import { EQUINOX_URL, SITE_NAME } from "./brand";
import { SITE_URL } from "./constants";

/**
 * Yapılandırılmış veri (schema.org) üreticileri.
 *
 * Kapsam bilinçli olarak dar tutuldu. Yalnızca doğru olduğundan emin
 * olduğumuz şeyler işaretleniyor:
 *
 * - `BreadcrumbList` — arama sonucunda gezinti izini gösterir, karşılığı net.
 * - `WebSite` / `Organization` — sitenin ve yayıncısının kimliği.
 * - `SoftwareApplication` — modelin ne olduğu ve kimin ürettiği.
 *
 * `Product` + `offers` bilinçli olarak KULLANILMADI. Fiyatlarımız "1 milyon
 * token başına" birim fiyatlardır; `offers.price` ise satın alınabilir bir
 * ürünün bedelini ifade eder. İkisini eşitlemek arama motoruna yanlış bilgi
 * vermek olurdu — 2 $'lık bir ürün diye işaretlenen şey aslında bir birim
 * fiyat. Fiyat bilgisi sayfada zaten metin olarak var.
 *
 * `trailingSlash: true` olduğu için buradaki tüm adresler sonda eğik çizgiyle
 * biter; kanonik adreslerle birebir aynı olmaları gerekir.
 */

/** Sitenin schema.org'daki kimliği — diğer düğümler buna bağlanır. */
const WEBSITE_ID = `${SITE_URL}/#website`;
const PUBLISHER_ID = `${EQUINOX_URL}/#organization`;

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: "tr-TR",
    description:
      "Yapay zekâ modellerini bağlam penceresi, fiyat ve yeteneklerine göre karşılaştıran Türkçe rehber.",
    publisher: {
      "@type": "Organization",
      "@id": PUBLISHER_ID,
      name: "Equinox",
      url: EQUINOX_URL,
    },
  };
}

type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

export function modelJsonLd(model: Model, provider: Provider) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: model.name,
    url: `${SITE_URL}/modeller/${model.slug}/`,
    description: model.summary,
    applicationCategory: "DeveloperApplication",
    // Bir API modeli belirli bir işletim sistemine bağlı değil.
    operatingSystem: "Web",
    inLanguage: "tr-TR",
    author: {
      "@type": "Organization",
      name: provider.name,
      url: provider.website,
    },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
