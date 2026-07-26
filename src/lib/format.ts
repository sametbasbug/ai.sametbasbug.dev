const priceFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const preciseFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
});

const numberFormatter = new Intl.NumberFormat("tr-TR");

/**
 * 1_000_000 -> "1M", 200_000 -> "200K", 8_192 -> "8.192".
 * Binlik kısaltma için "B" değil "K" kullanılır: "B" Türkçe okuyucuda "bin",
 * İngilizce okuyucuda "billion" çağrıştırdığı için belirsiz kalıyor.
 */
export function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) {
    const millions = tokens / 1_000_000;
    return `${numberFormatter.format(millions)}M`;
  }
  if (tokens >= 1_000 && tokens % 1_000 === 0) {
    return `${numberFormatter.format(tokens / 1_000)}K`;
  }
  return numberFormatter.format(tokens);
}

/** Karşılaştırma tablosunda tam değeri göstermek için. */
export function formatTokens(tokens: number): string {
  return `${numberFormatter.format(tokens)} token`;
}

/** 0.435 -> "0,435 $" — kuruş altı fiyatlarda hassasiyeti korur. */
export function formatPrice(usdPerMillion: number): string {
  const formatter = usdPerMillion < 1 ? preciseFormatter : priceFormatter;
  return `${formatter.format(usdPerMillion)} $`;
}

/**
 * Hesaplayıcı toplamları. Fiyat birimlerinden farklı bir ölçekte gezinir:
 * aylık tutar binlerce dolar da olabilir, birkaç kuruş da. Sabit basamak
 * sayısı ikisinden birini okunmaz yapardı — 1.234,5678 $ ya da 0,00 $.
 */
export function formatCost(usd: number): string {
  const digits = usd === 0 ? 2 : usd >= 1 ? 2 : usd >= 0.01 ? 3 : 4;
  return `${new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(usd)} $`;
}

export function formatParameters(billions: number): string {
  return `${numberFormatter.format(billions)} milyar`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
