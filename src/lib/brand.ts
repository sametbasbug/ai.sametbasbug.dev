/**
 * Equinox ağı bağı.
 *
 * Model Atlası, Samet Başbuğ'un Equinox ağındaki ürünlerden biridir. Bu dosya
 * bağın tek kaynağıdır: ad, adres ve imza metni burada
 * durur, arayüzde elle tekrarlanmaz.
 *
 * Görsel kimlik bilinçli olarak kopyalanmadı. Equinox'un kendi sayfası koyu ve
 * atmosferiktir; Model Atlası ise fiyat sütunları ve karşılaştırma tabloları
 * olan veri yoğun bir sitedir. Bağ; ad kilidi, Equinox altını ve ağdaki her
 * ürüne özgü renkli işaret sistemiyle kurulur — ortak favicon veya zemin
 * paletiyle değil.
 */

/** Equinox ana kapısı. Ağdaki yüzeylerin güncel listesi burada durur. */
export const EQUINOX_URL = "https://equinox.sametbasbug.dev";

/** Ajan profilleri, ortak akış ve proje izleri için kamusal yüzey. */
export const ORBIT_URL = "https://orbit.sametbasbug.dev";

/** Model Atlası'nda doğrudan görev alan ajanların Orbit profilleri. */
export const HEMERA_ORBIT_URL = `${ORBIT_URL}/agents/hemera/`;
export const NYX_ORBIT_URL = `${ORBIT_URL}/agents/nyx/`;

/** Ana blog — Equinox ağının uzun biçimli yazı yüzeyi. */
export const BLOG_URL = "https://sametbasbug.dev";

/**
 * Kaynak kodu deposu. Sitenin tek iddiası veri doğruluğu olduğu için hem
 * düzeltme kanalı hem de şeffaflık burada duruyor: okuyucu her değerin
 * nereden geldiğini depoda görebilir.
 */
export const REPO_URL = "https://github.com/sametbasbug/ai.sametbasbug.dev";

/**
 * Hatalı veri bildirimi için başlığı ve gövdesi önceden doldurulmuş issue
 * bağlantısı. Şablon, bildirimin işe yarar olması için gereken üç şeyi
 * sorar: hangi model, hangi değer, hangi kaynak.
 */
export const REPORT_URL = `${REPO_URL}/issues/new?${new URLSearchParams({
  title: "Veri düzeltmesi: ",
  labels: "veri",
  body: [
    "**Hangi model?**",
    "",
    "**Hangi değer yanlış veya eksik?**",
    "",
    "**Doğrusu ne olmalı? (sağlayıcının resmî sayfasından bağlantı)**",
    "",
  ].join("\n"),
}).toString()}`;

/**
 * Sitenin tam adı. Başlık etiketleri, Open Graph ve yapılandırılmış veri bunu
 * kullanır; arayüzdeki kilit ise "Equinox" ve "Model Atlası" parçalarını ayrı
 * gösterir.
 */
export const SITE_NAME = "Equinox Model Atlası";

/** Kilidin üst satırı — ağ adı. */
export const BRAND_PREFIX = "Equinox";

/**
 * Kilidin büyük harfli biçimi, harfi harfine yazılmış.
 *
 * CSS `text-transform: uppercase` burada kullanılamaz: belge `lang="tr"`
 * olduğu için tarayıcı Türkçe büyütme kuralını uygular ve `i` harfini noktalı
 * `İ` yapar — kilit "EQUİNOX" olarak çıkar. Türkçe sözcükler için doğru olan
 * bu davranış, marka adı için yanlıştır.
 */
export const BRAND_PREFIX_UPPER = "EQUINOX";

/** Kilidin alt satırı — sitenin kendi adı, baskın olan parça. */
export const BRAND_NAME = "Model Atlası";
