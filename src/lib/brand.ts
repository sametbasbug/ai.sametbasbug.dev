/**
 * Equinox marka bağı.
 *
 * Model Atlası, Samet Başbuğ'un Equinox ekosistemindeki yayın yüzeylerinden
 * biridir. Bu dosya bağın tek kaynağıdır: ad, adres ve imza metni burada
 * durur, arayüzde elle tekrarlanmaz.
 *
 * Görsel kimlik bilinçli olarak devralınmadı. Equinox'un kendi sayfası koyu ve
 * atmosferiktir; Model Atlası ise fiyat sütunları ve karşılaştırma tabloları
 * olan veri yoğun bir sitedir. Ortak olan işaret, altın vurgu ve ad kilidi —
 * zemin paleti değil.
 */

/** Ekosistem giriş sayfası. Kardeş yüzeylerin güncel listesi orada durur. */
export const EQUINOX_URL = "https://equinox.sametbasbug.dev";

/** Ana blog — Equinox'un uzun biçimli yayın yüzeyi. */
export const BLOG_URL = "https://sametbasbug.dev";

/**
 * Sitenin tam adı. Başlık etiketleri, Open Graph ve yapılandırılmış veri bunu
 * kullanır; arayüzdeki kilit ise "Equinox" ve "Model Atlası" parçalarını ayrı
 * gösterir.
 */
export const SITE_NAME = "Equinox Model Atlası";

/** Kilidin üst satırı — ekosistem adı. */
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
