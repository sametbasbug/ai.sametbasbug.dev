import { models } from "@/data/models";

/**
 * Verinin ne kadar taze olduğu.
 *
 * Site elle derlenmiş veriye dayanıyor ve Hakkında sayfasında okuyucuya
 * "her modelin kaynağı ve doğrulama tarihi yazılıdır" sözü veriliyor. O söz
 * ancak tarih görünürse bir anlam taşır: 25 Temmuz'da doğru olan bir fiyat
 * altı ay sonra da aynı güvenle sunulursa, tarihi yazmak okuyucuyu korumaz.
 *
 * Ölçüt katalogdaki **en eski** doğrulama tarihidir. Ortalama ya da en yeni
 * tarih, tek bir modeli güncelleyip gerisini bırakmayı taze gösterirdi.
 */
export const OLDEST_VERIFIED = models.reduce(
  (oldest, model) =>
    model.source.verifiedAt < oldest ? model.source.verifiedAt : oldest,
  models[0].source.verifiedAt,
);

/**
 * Bu günden sonra veri "tazelenmeli" sayılır ve arayüzde uyarı tonuna geçer.
 *
 * Model fiyatları ve kimlikleri sık değişiyor; kırk beş gün, bir sağlayıcının
 * fiyat güncellemesini kaçırmadan makul aralıkla kontrol etmek için seçildi.
 */
export const STALE_AFTER_DAYS = 45;

/**
 * İki tarih arasındaki tam gün sayısı.
 *
 * Takvim günü üzerinden hesaplanıyor, milisaniye farkı üzerinden değil: yaz
 * saati geçişinde 23 ya da 25 saatlik günler var ve bölme işlemi orada bir
 * gün kayabiliyor.
 */
export function daysSince(iso: string, now: Date): number {
  const [year, month, day] = iso.split("-").map(Number);
  const then = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((today - then) / 86_400_000));
}
