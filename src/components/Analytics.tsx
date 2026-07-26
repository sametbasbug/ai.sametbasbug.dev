/**
 * Çerezsiz ziyaretçi sayacı (Cloudflare Web Analytics).
 *
 * Neden bu: alan adının DNS'i zaten Cloudflare'de, ücretsiz, çerez koymuyor
 * ve bireysel ziyaretçi profili çıkarmıyor. Kimliksiz ölçüm yaptığı için
 * kullanıcıdan onay istemeyi gerektiren bir izleme sayılmıyor — sitede çerez
 * bandı olmamasının nedeni bu.
 *
 * Belirteç gizli bir bilgi değil: sayfa kaynağında herkese görünür ve
 * yalnızca hangi siteye ait olduğunu söyler. Yine de depoya yazılmıyor,
 * ortam değişkeninden okunuyor — böylece depoyu çatallayan biri kendi
 * ölçümünü bağlar, bizimkine veri göndermez.
 *
 * Belirteç tanımlı değilse hiçbir şey çizilmez. Yerel geliştirmede ve
 * çatallarda sayaç kendiliğinden kapalıdır; ayrıca bir koşul gerekmez.
 */
const TOKEN = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

export function Analytics() {
  if (!TOKEN) return null;

  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: TOKEN })}
    />
  );
}
