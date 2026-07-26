#!/usr/bin/env node
/**
 * Kaynak sayfalarının değişip değişmediğini bildirir.
 *
 * Sitenin tamamı elle doğrulanmış veriye dayanıyor ve her modelin detay
 * sayfasında "şu tarihte doğrulandı" yazıyor. Bu söz, birinin sağlayıcı
 * sayfalarını düzenli açmasına bağlı. Bu betik o işi ortadan kaldırmaz —
 * hangi sayfaya bakmak gerektiğini söyler.
 *
 * Ne yapar: her kaynak adresini çeker, metnini çıkarır, depodaki anlık
 * görüntüyle karşılaştırır. Değişen sayfaları listeler. Anlık görüntüler düz
 * metin olarak saklanır, böylece `git diff` neyin değiştiğini de gösterir.
 *
 * Ne yapmaz: fiyatı okuyup veriyle karşılaştırmaz. Sayfa düzeni değiştiğinde
 * bunu yapan bir ayrıştırıcı sessizce yanlış cevap verirdi; kararı insana
 * bırakmak doğru olan.
 *
 * Okunamayan sayfalar sessizce "değişmedi" sayılmaz. Bazı sağlayıcılar
 * fiyat tablosunu tarayıcıda JavaScript ile çiziyor; düz bir `fetch` o
 * sayfalarda yalnızca boş bir kabuk alır ve kabuk hiç değişmediği için betik
 * ilelebet "sorun yok" derdi. Yanlış güven, hiç bilgi olmamasından kötüdür:
 * eşiğin altında metin dönen sayfalar OKUNAMADI olarak işaretlenir ve elle
 * bakılması gerektiği söylenir.
 *
 * Kullanım:
 *   node scripts/kaynak-kontrol.mjs             Kontrol et, rapor yaz
 *   node scripts/kaynak-kontrol.mjs --guncelle  Anlık görüntüleri tazele
 *
 * Çıkış kodu: değişen ya da okunamayan kaynak varsa 1, yoksa 0.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { models } from "../src/data/models.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IZ_DIZINI = join(ROOT, "kaynak-izi");
const METIN_DIZINI = join(IZ_DIZINI, "metin");
const DURUM_DOSYASI = join(IZ_DIZINI, "durum.json");

/**
 * Bu uzunluğun altında metin dönen sayfa okunamamış sayılır.
 *
 * Değer tahmin değil, 2026-07-26'daki ilk çekimde ölçüldü: okunabilen en kısa
 * sayfa 2.341 karakter (DeepSeek), en uzunu 134.919 (Alibaba); JavaScript ile
 * çizilen Llama sayfası ise 40 karakter döndü. Eşik bu boşluğun ortasında.
 */
const ASGARI_METIN = 800;

const ISTEK_BASLIKLARI = {
  // Kimliğimizi saklamıyoruz: sağlayıcı günlüğünde bunun ne olduğu görünsün.
  "user-agent":
    "ModelAtlasiKaynakKontrol/1.0 (+https://ai.sametbasbug.dev/hakkinda/)",
  "accept-language": "en,tr;q=0.8",
};

const ZAMAN_ASIMI_MS = 20_000;
/** Sağlayıcıları arka arkaya yormamak için istekler arası bekleme. */
const BEKLEME_MS = 1_000;

/** Adresten dosya adı: `docs.x.ai__docs-pricing.txt`. */
function dosyaAdi(url) {
  const { hostname, pathname } = new URL(url);
  const yol = pathname.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-");
  return `${hostname}__${yol || "kok"}.txt`;
}

/**
 * HTML'den okunabilir metin çıkarır.
 *
 * Bağımlılık eklemiyoruz: amaç sayfayı ayrıştırmak değil, iki çekim arasında
 * karşılaştırılabilir kararlı bir metin üretmek. Betik ve stil blokları
 * atılır çünkü içlerindeki üretilmiş kimlikler her çekimde değişir ve her
 * seferinde sahte bir "değişti" üretirdi.
 */
function metneCevir(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, kod) => String.fromCodePoint(Number(kod)))
    .replace(/[ \t ]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ozet(metin) {
  return createHash("sha256").update(metin).digest("hex").slice(0, 16);
}

async function cek(url) {
  const iptal = AbortSignal.timeout(ZAMAN_ASIMI_MS);
  const yanit = await fetch(url, { headers: ISTEK_BASLIKLARI, signal: iptal });
  if (!yanit.ok) {
    throw new Error(`HTTP ${yanit.status}`);
  }
  return metneCevir(await yanit.text());
}

async function oncekiDurum() {
  try {
    return JSON.parse(await readFile(DURUM_DOSYASI, "utf8"));
  } catch {
    return { kaynaklar: {} };
  }
}

/** Kaynak adreslerini modellerden toplar; her adres bir kez kontrol edilir. */
function kaynaklariTopla() {
  const kaynaklar = new Map();
  for (const model of models) {
    const kayit = kaynaklar.get(model.source.url) ?? {
      url: model.source.url,
      verifiedAt: model.source.verifiedAt,
      modeller: [],
    };
    kayit.modeller.push(model.slug);
    // Aynı adres farklı tarihlerle işaretlenmişse en eskisi bağlayıcıdır.
    if (model.source.verifiedAt < kayit.verifiedAt) {
      kayit.verifiedAt = model.source.verifiedAt;
    }
    kaynaklar.set(model.source.url, kayit);
  }
  return [...kaynaklar.values()];
}

const guncelle = process.argv.includes("--guncelle");

const kaynaklar = kaynaklariTopla();
const onceki = await oncekiDurum();
const yeniDurum = { alindi: new Date().toISOString(), kaynaklar: {} };
const sonuclar = [];

await mkdir(METIN_DIZINI, { recursive: true });

for (const [sira, kaynak] of kaynaklar.entries()) {
  if (sira > 0) await new Promise((c) => setTimeout(c, BEKLEME_MS));

  const ad = dosyaAdi(kaynak.url);
  let metin;
  try {
    metin = await cek(kaynak.url);
  } catch (hata) {
    sonuclar.push({ ...kaynak, durum: "HATA", not: String(hata.message) });
    // Erişilemeyen sayfanın eski kaydı korunur: silmek, bir sonraki çalıştırmada
    // her şeyi "yeni" gösterip gerçek değişikliği gizlerdi.
    yeniDurum.kaynaklar[kaynak.url] = onceki.kaynaklar?.[kaynak.url] ?? null;
    continue;
  }

  const okunabilir = metin.length >= ASGARI_METIN;
  const yeniOzet = ozet(metin);
  const eski = onceki.kaynaklar?.[kaynak.url];

  let durum;
  if (!okunabilir) durum = "OKUNAMADI";
  else if (!eski) durum = "YENİ";
  else if (eski.ozet === yeniOzet) durum = "aynı";
  else durum = "DEĞİŞTİ";

  sonuclar.push({
    ...kaynak,
    durum,
    karakter: metin.length,
    not: okunabilir ? "" : "sayfa büyük olasılıkla JavaScript ile çiziliyor",
  });

  yeniDurum.kaynaklar[kaynak.url] = {
    ozet: yeniOzet,
    karakter: metin.length,
    okunabilir,
    dosya: `metin/${ad}`,
    verifiedAt: kaynak.verifiedAt,
  };

  if (guncelle && okunabilir) {
    await writeFile(join(METIN_DIZINI, ad), `${metin}\n`, "utf8");
  }
}

if (guncelle) {
  await writeFile(DURUM_DOSYASI, `${JSON.stringify(yeniDurum, null, 2)}\n`, "utf8");
}

// ------------------------------------------------------------------- rapor
const genislik = 11;
console.log(
  guncelle
    ? "Kaynak anlık görüntüleri tazelendi.\n"
    : "Kaynak kontrolü (anlık görüntüleri yazmak için --guncelle).\n",
);

for (const sonuc of sonuclar) {
  const etiket = sonuc.durum.padEnd(genislik);
  const model = `${String(sonuc.modeller.length).padStart(2)} model`;
  console.log(`${etiket} ${model}  ${sonuc.url}`);
  if (sonuc.not) console.log(`${" ".repeat(genislik)}          ↳ ${sonuc.not}`);
}

const degisen = sonuclar.filter((s) => s.durum === "DEĞİŞTİ");
const sorunlu = sonuclar.filter(
  (s) => s.durum === "OKUNAMADI" || s.durum === "HATA",
);

console.log("");
if (degisen.length > 0) {
  const modelSayisi = degisen.reduce((t, s) => t + s.modeller.length, 0);
  console.log(
    `${degisen.length} kaynak sayfası değişmiş, ${modelSayisi} modeli etkiliyor.`,
  );
  console.log("Neyin değiştiğini görmek için: git diff kaynak-izi/metin/");
}
if (sorunlu.length > 0) {
  console.log(
    `${sorunlu.length} kaynak otomatik okunamıyor — bu sayfalara elle bakılmalı.`,
  );
}
if (degisen.length === 0 && sorunlu.length === 0) {
  console.log("Okunabilen kaynakların hiçbiri değişmemiş.");
}

console.log(
  "\nDoğrulama sonrası: models.ts içindeki verifiedAt alanlarını güncelleyin,",
);
console.log("ardından bu betiği --guncelle ile çalıştırın.");

process.exit(degisen.length > 0 || sorunlu.length > 0 ? 1 : 0);
