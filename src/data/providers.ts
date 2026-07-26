import type { Provider, ProviderId } from "./types";

export const providers: Provider[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    country: "ABD",
    blurb:
      "Claude ailesinin geliştiricisi. Uzun soluklu ajan görevleri, kod yazımı ve güvenlik odaklı tasarımıyla öne çıkar.",
    website: "https://www.anthropic.com",
    accent: "#c96442",
  },
  {
    id: "openai",
    name: "OpenAI",
    country: "ABD",
    blurb:
      "GPT ailesinin geliştiricisi. En geniş ekosisteme ve en yaygın araç desteğine sahip sağlayıcı.",
    website: "https://openai.com",
    accent: "#10a37f",
  },
  {
    id: "google",
    name: "Google",
    country: "ABD",
    blurb:
      "Gemini ailesinin geliştiricisi. Çok kipli (metin, görsel, ses, video) girdi ve devasa bağlam pencereleri sunar.",
    website: "https://ai.google.dev",
    accent: "#4285f4",
  },
  {
    id: "xai",
    name: "xAI",
    country: "ABD",
    blurb:
      "Grok ailesinin geliştiricisi. X (Twitter) verisine gerçek zamanlı erişim ve çok geniş bağlam pencereleri sunar.",
    website: "https://x.ai",
    accent: "#6b7280",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    country: "Çin",
    blurb:
      "Fiyat/performans dengesiyle bilinen Çinli sağlayıcı. Batılı muadillerine göre çarpıcı biçimde ucuzdur.",
    website: "https://www.deepseek.com",
    accent: "#4d6bfe",
  },
  {
    id: "meta",
    name: "Meta",
    country: "ABD",
    blurb:
      "Llama ailesinin geliştiricisi. Ağırlıkları indirilebilen, kendi altyapınızda çalıştırabileceğiniz modeller sunar.",
    website: "https://www.llama.com",
    accent: "#0866ff",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    country: "Fransa",
    blurb:
      "Avrupa merkezli sağlayıcı. Veri egemenliği ve KVKK/GDPR uyumu önemseyen kurumlar için tercih edilir.",
    website: "https://mistral.ai",
    accent: "#fa520f",
  },
  {
    id: "alibaba",
    name: "Alibaba",
    country: "Çin",
    blurb:
      "Qwen ailesinin geliştiricisi. Hem kapalı API hem de güçlü açık ağırlıklı sürümler yayımlar.",
    website: "https://qwen.ai",
    accent: "#615ced",
  },
  {
    id: "amazon",
    name: "Amazon",
    country: "ABD",
    blurb:
      "Nova ailesinin geliştiricisi. Modelleri yalnızca Amazon Bedrock üzerinden sunulur; fiyatlandırma AWS hesabınıza işler.",
    website: "https://aws.amazon.com/nova/",
    accent: "#ff9900",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    country: "ABD",
    blurb:
      "Phi ailesinin geliştiricisi. Küçük ama akıl yürütmeye odaklı modelleri MIT lisansıyla açık ağırlıklı yayımlar.",
    website: "https://azure.microsoft.com/en-us/products/phi/",
    accent: "#0078d4",
  },
  {
    id: "vngrs",
    name: "VNGRS",
    country: "Türkiye",
    blurb:
      "Kumru'nun geliştiricisi. Sıfırdan Türkçe veriyle eğitilen ilk yerli büyük dil modelini yayımladı.",
    website: "https://vngrs.com",
    accent: "#e11d48",
  },
];

export const providerMap: Record<ProviderId, Provider> = Object.fromEntries(
  providers.map((p) => [p.id, p]),
) as Record<ProviderId, Provider>;
