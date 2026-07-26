import type { Pricing, PricingTier } from "@/data/types";
import { formatContext } from "./format";

/**
 * Fiyat çözümleme ve maliyet tahmini.
 *
 * Buradaki her şey saf fonksiyondur ve hem sunucuda hem istemcide çalışır:
 * detay sayfası kademe tablosunu sunucuda çizer, hesaplayıcı aynı işlevleri
 * tarayıcıda çağırır. İki yerde iki ayrı hesap olursa er geç ayrışırlar.
 */

/** Belirli bir istem uzunluğunda ve tarihte geçerli olan fiyatlar. */
export interface Rates {
  input: number;
  output: number;
  cachedInput?: number;
  /** Devrede olan kademe; taban fiyattaysa `null`. */
  tier: PricingTier | null;
  /** Tanıtım fiyatı uygulandı mı. */
  promoApplied: boolean;
  /**
   * Önbellek fiyatı taban değerden alındı mı. Kademe veya kampanya
   * devredeyken sağlayıcı önbellek fiyatını ayrıca açıklamadıysa doğrudur —
   * arayüz bunu okuyucuya varsayım olarak bildirmelidir.
   */
  cachedInputAssumed: boolean;
}

/** `Date` -> "2026-07-26". Yerel takvim günü; UTC kayması istemiyoruz. */
function isoDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Bir istemin hangi fiyattan ücretlendirileceğini bulur.
 *
 * `promptTokens` istemin tamamıdır (önbellekten gelen kısım dahil): kademe
 * eşiği isteğin uzunluğuna bakar, ücretlendirme biçimine değil.
 *
 * Kademe kampanyaya baskındır. Bir modelde ikisi birden olsaydı kampanyanın
 * uzun bağlam fiyatına da uygulanıp uygulanmadığını bilemezdik; şu an böyle
 * bir model yok, varsayım üretmek yerine kademede kalıyoruz.
 */
export function ratesFor(
  pricing: Pricing,
  promptTokens: number,
  on: Date = new Date(),
): Rates {
  const tier =
    pricing.tiers?.reduce<PricingTier | null>(
      (active, candidate) =>
        promptTokens > candidate.over ? candidate : active,
      null,
    ) ?? null;

  if (tier) {
    return {
      input: tier.input,
      output: tier.output,
      cachedInput: tier.cachedInput ?? pricing.cachedInput,
      tier,
      promoApplied: false,
      cachedInputAssumed:
        tier.cachedInput === undefined && pricing.cachedInput !== undefined,
    };
  }

  const promo = pricing.promo;
  if (promo && isoDay(on) <= promo.until) {
    return {
      input: promo.input,
      output: promo.output,
      cachedInput: pricing.cachedInput,
      tier: null,
      promoApplied: true,
      cachedInputAssumed: pricing.cachedInput !== undefined,
    };
  }

  return {
    input: pricing.input,
    output: pricing.output,
    cachedInput: pricing.cachedInput,
    tier: null,
    promoApplied: false,
    cachedInputAssumed: false,
  };
}

export interface Usage {
  /** İstek başına girdi token'ı. */
  inputTokens: number;
  /** İstek başına çıktı token'ı. */
  outputTokens: number;
  /** Dönem başına istek sayısı. */
  requests: number;
  /** Girdinin önbellekten okunan oranı, 0–1. */
  cachedRatio: number;
}

export interface Cost {
  inputCost: number;
  outputCost: number;
  total: number;
  rates: Rates;
  /** Model önbellekleme fiyatı açıklamadığı için önbellek oranı yok sayıldı. */
  cacheIgnored: boolean;
}

/** Verilen kullanım için toplam USD maliyeti. */
export function estimateCost(
  pricing: Pricing,
  usage: Usage,
  on: Date = new Date(),
): Cost {
  const rates = ratesFor(pricing, usage.inputTokens, on);

  // Önbellek fiyatı açıklanmamışsa oran ne olursa olsun her token tam fiyat:
  // indirimi uydurmaktansa yok saymak doğru sonucu verir.
  const cacheIgnored = rates.cachedInput === undefined && usage.cachedRatio > 0;
  const cachedTokens =
    rates.cachedInput === undefined ? 0 : usage.inputTokens * usage.cachedRatio;
  const freshTokens = usage.inputTokens - cachedTokens;

  const perMillion = usage.requests / 1_000_000;
  const inputCost =
    (freshTokens * rates.input + cachedTokens * (rates.cachedInput ?? 0)) *
    perMillion;
  const outputCost = usage.outputTokens * rates.output * perMillion;

  return {
    inputCost,
    outputCost,
    total: inputCost + outputCost,
    rates,
    cacheIgnored,
  };
}

export interface TierRow {
  /** "32K token'a kadar", "32K – 256K token", "256K token üstü". */
  label: string;
  input: number;
  output: number;
  cachedInput?: number;
}

/** Kademe tablosunu çizmek için satırlar. Kademesiz modelde boş dizi. */
export function tierRows(pricing: Pricing): TierRow[] {
  const tiers = pricing.tiers;
  if (!tiers || tiers.length === 0) return [];

  const base: TierRow = {
    label: `${formatContext(tiers[0].over)} token'a kadar`,
    input: pricing.input,
    output: pricing.output,
    cachedInput: pricing.cachedInput,
  };

  const rest = tiers.map((tier, index) => {
    const next = tiers[index + 1];
    return {
      label: next
        ? `${formatContext(tier.over)} – ${formatContext(next.over)} token`
        : `${formatContext(tier.over)} token üstü`,
      input: tier.input,
      output: tier.output,
      cachedInput: tier.cachedInput ?? pricing.cachedInput,
    };
  });

  return [base, ...rest];
}

/**
 * Taban fiyatın hangi istem uzunluğuna kadar geçerli olduğu. Kademesiz
 * modellerde `null` — fiyat bağlam penceresinin tamamında aynıdır.
 */
export function baseValidUpTo(pricing: Pricing): number | null {
  return pricing.tiers?.[0]?.over ?? null;
}
