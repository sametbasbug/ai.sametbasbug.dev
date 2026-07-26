import { models } from "@/data/models";
import type { Capability, Model } from "@/data/types";

/**
 * Katalogun kendisinden türetilen görüntüleme kararları.
 *
 * Buradaki eşikler sabit sayı değil, veriden hesaplanır: katalog büyüdükçe
 * neyin "yaygın", neyin "ayırt edici" olduğu kendiliğinden güncellenir.
 */

const capabilityCounts = models.reduce<Partial<Record<Capability, number>>>(
  (counts, model) => {
    for (const capability of model.capabilities) {
      counts[capability] = (counts[capability] ?? 0) + 1;
    }
    return counts;
  },
  {},
);

/**
 * Bir yetenek katalogdaki modellerin bu oranından fazlasında varsa artık
 * ayırt edici değildir ve rozet olarak gösterilmez.
 *
 * Neden gerekli: 31 modelin 29'unda "araç kullanımı", 26'sında "görsel
 * anlama" var. Bunları her kartta tekrarlamak bilgi vermiyor, yalnızca desen
 * üretiyor — ana sayfada iki yüzden fazla birbirinin aynı rozet oluşuyordu.
 * Okuyucunun aradığı şey modelin diğerlerinden nerede ayrıldığı.
 *
 * Eşik yarıda: üçte ikiyle denendi ve yetmedi — %61'lik "akıl yürütme" ile
 * "toplu işlem" listenin neredeyse her satırında tekrar etmeye devam etti.
 * Bir yetenek modellerin yarısından fazlasında varsa onu görmek okuyucuya
 * hiçbir şey söylemiyor. Modelin yeteneklerinin tamamı detay sayfasında.
 */
const DISTINCTIVE_MAX_SHARE = 1 / 2;

/**
 * Modelin ayırt edici yetenekleri, en nadirden başlayarak.
 *
 * Hiçbiri eşiği geçmiyorsa boş dizi döner — o modelin gerçekten ayırt edici
 * bir yeteneği yoktur ve yer doldurmak için yaygın olanları göstermeyiz.
 */
export function distinctiveCapabilities(
  model: Model,
  limit = 2,
): Capability[] {
  const threshold = models.length * DISTINCTIVE_MAX_SHARE;
  return model.capabilities
    .filter((capability) => (capabilityCounts[capability] ?? 0) < threshold)
    .sort(
      (a, b) => (capabilityCounts[a] ?? 0) - (capabilityCounts[b] ?? 0),
    )
    .slice(0, limit);
}

const outputPrices = models
  .map((model) => model.pricing?.output)
  .filter((price): price is number => price !== undefined);

const minOutput = Math.min(...outputPrices);
const maxOutput = Math.max(...outputPrices);

/**
 * Fiyatın katalog aralığındaki konumu, 0–1.
 *
 * Logaritmik: en ucuz çıktı 0,13 $, en pahalısı 180 $ — bin kattan fazla fark
 * var. Doğrusal ölçekte 30 $ altındaki her model aynı görünürdü, yani
 * modellerin neredeyse tamamı.
 */
export function pricePosition(usd: number): number {
  const span = Math.log10(maxOutput) - Math.log10(minOutput);
  if (span <= 0) return 1;
  const position = (Math.log10(usd) - Math.log10(minOutput)) / span;
  // Ölçek en ucuz modelde de görünür bir iz bıraksın.
  return Math.min(1, Math.max(0.04, position));
}
