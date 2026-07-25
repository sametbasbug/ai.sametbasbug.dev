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

export interface Pricing {
  /** 1 milyon girdi token'ı için USD. */
  input: number;
  /** 1 milyon çıktı token'ı için USD. */
  output: number;
  /** Önbellekten okunan 1 milyon girdi token'ı için USD. */
  cachedInput?: number;
  /** Fiyatlandırmaya dair istisna veya kampanya notu. */
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
