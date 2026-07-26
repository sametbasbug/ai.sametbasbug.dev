export type ProviderId =
  | "anthropic"
  | "openai"
  | "google"
  | "xai"
  | "deepseek"
  | "meta"
  | "mistral"
  | "alibaba"
  | "vngrs";

export interface Provider {
  id: ProviderId;
  name: string;
  country: string;
  /** Kısa Türkçe tanıtım. */
  blurb: string;
  website: string;
  /** Kart ve rozetlerde kullanılan vurgu rengi (CSS rengi). */
  accent: string;
}

export type License = "kapali" | "acik-agirlik";

export type Modality = "metin" | "gorsel" | "ses" | "video";

export type Capability =
  | "akil-yurutme"
  | "gorsel-anlama"
  | "arac-kullanimi"
  | "kod"
  | "uzun-baglam"
  | "onbellekleme"
  | "toplu-islem"
  | "ince-ayar"
  | "yerel-calisma";

/**
 * İstem uzunluğuna bağlı fiyat kademesi.
 *
 * Bu katalogdaki sağlayıcıların hepsi (xAI, Google, Alibaba) aynı kuralı
 * uyguluyor: istem eşiği aştığında o isteğin **tüm** token'ları yeni fiyattan
 * ücretlendirilir. Gelir vergisi gibi dilimlenmez — eşiğe kadarki kısım taban
 * fiyatta kalmaz. Hesaplayıcı bu kurala göre çalışır; farklı davranan bir
 * sağlayıcı eklenirse bu tipin de değişmesi gerekir.
 */
export interface PricingTier {
  /** İstem bu token sayısını *aştığında* kademe devreye girer. */
  over: number;
  /** 1 milyon girdi token'ı için USD. */
  input: number;
  /** 1 milyon çıktı token'ı için USD. */
  output: number;
  /**
   * Kademedeki önbellekli girdi fiyatı. Sağlayıcıların çoğu bunu ayrıca
   * açıklamıyor; belirtilmediğinde taban fiyat kullanılır ve hesaplayıcı
   * bunu kullanıcıya not olarak söyler.
   */
  cachedInput?: number;
}

/** Belirli bir tarihe kadar geçerli tanıtım fiyatı. */
export interface PricingPromo {
  input: number;
  output: number;
  /** Son geçerlilik günü (ISO, bu gün dahil). */
  until: string;
}

export interface Pricing {
  /** 1 milyon girdi token'ı için USD. */
  input: number;
  /** 1 milyon çıktı token'ı için USD. */
  output: number;
  /** Önbellekten okunan 1 milyon girdi token'ı için USD. */
  cachedInput?: number;
  /**
   * Taban fiyatın üstündeki kademeler, `over` değerine göre artan sırada.
   * Taban fiyat ilk kademenin eşiğine kadar geçerlidir.
   */
  tiers?: PricingTier[];
  /** Süreli tanıtım fiyatı — geçerliyken taban fiyatın yerine geçer. */
  promo?: PricingPromo;
  /** Yapılandırılmış alanlara sığmayan istisna notu. */
  note?: string;
}

export interface Model {
  /** URL'de kullanılan benzersiz kimlik. */
  slug: string;
  name: string;
  providerId: ProviderId;
  /** API çağrılarında kullanılan model kimliği. */
  apiId: string;
  license: License;
  /** Token cinsinden bağlam penceresi. */
  contextWindow: number;
  /** Token cinsinden azami çıktı uzunluğu. */
  maxOutput?: number;
  /** Açık ağırlıklı modellerde `null` — barındırma maliyeti size aittir. */
  pricing: Pricing | null;
  /** Milyar cinsinden parametre sayısı (açıklanmışsa). */
  parameters?: number;
  inputModalities: Modality[];
  outputModalities: Modality[];
  capabilities: Capability[];
  /** Listeleme kartlarında görünen tek cümlelik özet. */
  summary: string;
  /** Detay sayfasındaki uzun açıklama. */
  description: string;
  strengths: string[];
  weaknesses: string[];
  useCases: string[];
  docsUrl: string;
  /** Verinin nereden ve ne zaman doğrulandığı. */
  source: { url: string; verifiedAt: string };
}
