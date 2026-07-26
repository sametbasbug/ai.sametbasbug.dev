import type { Model } from "./types";

const ANTHROPIC_SRC = {
  url: "https://platform.claude.com/docs/en/about-claude/models/overview",
  verifiedAt: "2026-07-25",
};
const OPENAI_SRC = {
  url: "https://developers.openai.com/api/docs/pricing",
  verifiedAt: "2026-07-25",
};
const GOOGLE_SRC = {
  url: "https://ai.google.dev/gemini-api/docs/pricing",
  verifiedAt: "2026-07-25",
};
const XAI_SRC = {
  url: "https://docs.x.ai/docs/pricing",
  verifiedAt: "2026-07-25",
};
const DEEPSEEK_SRC = {
  url: "https://api-docs.deepseek.com/quick_start/pricing",
  verifiedAt: "2026-07-25",
};
const MISTRAL_LARGE_SRC = {
  url: "https://docs.mistral.ai/models/model-cards/mistral-large-3-25-12",
  verifiedAt: "2026-07-25",
};
const MISTRAL_SMALL_SRC = {
  url: "https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03",
  verifiedAt: "2026-07-25",
};
const ALIBABA_SRC = {
  url: "https://www.alibabacloud.com/help/en/model-studio/model-pricing",
  verifiedAt: "2026-07-25",
};
const META_SRC = {
  url: "https://www.llama.com/docs/model-cards-and-prompt-formats/llama4/",
  verifiedAt: "2026-07-25",
};

const KUMRU_SRC = {
  url: "https://medium.com/vngrs/kumru-llm-34d1628cfd93",
  verifiedAt: "2026-07-25",
};

export const models: Model[] = [
  // ---------------------------------------------------------------- Anthropic
  {
    slug: "claude-fable-5",
    name: "Claude Fable 5",
    providerId: "anthropic",
    apiId: "claude-fable-5",
    license: "kapali",
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    pricing: { input: 10, output: 50 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Anthropic'in en yetenekli modeli; saatler süren otonom görevler ve en zor akıl yürütme problemleri için.",
    description:
      "Claude Fable 5, Anthropic'in genel kullanıma sunduğu en güçlü modeldir. Akıl yürütme her istekte otomatik olarak açıktır ve kapatılamaz; derinliği `effort` parametresiyle ayarlarsınız. Tek bir isteğin dakikalarca sürmesi normaldir — bu yüzden akış (streaming) ve uzun zaman aşımı süreleri planlamanız gerekir. Kurumsal düzeyde 30 günlük veri saklama şartı vardır, sıfır veri saklama politikasıyla kullanılamaz.",
    strengths: [
      "Uzun soluklu, çok adımlı otonom görevlerde sektörün en iyisi",
      "Karmaşık kod tabanlarında ilk denemede çalışan çözümler üretir",
      "Alt ajanlarla paralel çalışmayı güvenilir biçimde yönetir",
    ],
    weaknesses: [
      "Opus katmanının iki katı fiyat — rutin işler için aşırı pahalı",
      "Yanıt süreleri dakikalarla ölçülür, etkileşimli sohbete uygun değil",
      "Güvenlik sınıflandırıcıları siber ve biyoloji konularında isteği reddedebilir",
    ],
    useCases: [
      "Gecelik çalışan otonom kod taşıma ve refaktör görevleri",
      "Çok kaynaklı derin araştırma ve sentez",
      "Uçtan uca kurumsal analiz ve rapor üretimi",
    ],
    docsUrl: "https://platform.claude.com/docs/en/about-claude/models/overview",
    source: ANTHROPIC_SRC,
  },
  {
    slug: "claude-opus-5",
    name: "Claude Opus 5",
    providerId: "anthropic",
    apiId: "claude-opus-5",
    license: "kapali",
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    pricing: { input: 5, output: 25 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Karmaşık ajan tabanlı kod yazımı ve kurumsal işler için Anthropic'in amiral gemisi.",
    description:
      "Claude Opus 5, Opus 4.8'in yerini alan ve aynı fiyatı koruyan bir yükseltmedir. Akıl yürütme varsayılan olarak açıktır. Çok dosyalı özellik geliştirme, büyük refaktörler ve kod incelemesi gibi zor görevlerde belirgin biçimde öne çıkar; basit tek adımlı düzenlemelerde fark daha küçüktür. Düşük ve orta `effort` seviyelerinde bile beklenenden güçlü sonuç verdiği için maliyet ayarı yapmaya çok müsaittir.",
    strengths: [
      "Zor kod görevlerinde yüksek isabet, yarım bırakılmış çözüm üretmez",
      "Hata bulmada hem yüksek kesinlik hem yüksek kapsam",
      "Düşük `effort` seviyelerinde bile güçlü — maliyet ayarlanabilir",
    ],
    weaknesses: [
      "Varsayılan olarak uzun yanıtlar üretir, kısaltmak için açık yönlendirme gerekir",
      "İstenmeyen kapsam genişletmesi yapabilir",
      "Alt ajanlara gereğinden sık iş devreder, maliyeti artırabilir",
    ],
    useCases: [
      "Ajan tabanlı kod asistanları ve otomatik kod incelemesi",
      "Çok sayfalı belge ve tablo üretimi",
      "Uzun bağlamlı kurumsal soru-cevap sistemleri",
    ],
    docsUrl: "https://platform.claude.com/docs/en/about-claude/models/overview",
    source: ANTHROPIC_SRC,
  },
  {
    slug: "claude-opus-4-8",
    name: "Claude Opus 4.8",
    providerId: "anthropic",
    apiId: "claude-opus-4-8",
    license: "kapali",
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    pricing: { input: 5, output: 25 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Opus 4 serisinin olgunlaşmış son sürümü; sıcak ve açık yazım üslubuyla bilinir.",
    description:
      "Claude Opus 4.8, Opus 5 öncesinin en yetenekli modelidir ve hâlâ aktif olarak sunulmaktadır. Uzun soluklu ajan işlerinde ve hafıza kullanımında güçlüdür. Yazım üslubu Opus 4.7'ye göre belirgin biçimde daha sıcak ve daha az çekingendir. Opus 5'e geçmek istemeyen üretim sistemleri için istikrarlı bir seçenektir.",
    strengths: [
      "Opus 5 ile aynı fiyata istikrarlı, iyi test edilmiş davranış",
      "Açık ve akıcı uzun metin üretimi",
      "Hata ayıklama ve kod incelemesinde güçlü",
    ],
    weaknesses: [
      "Arama, alt ajan ve hafıza gibi araçlara kendiliğinden az başvurur",
      "Küçük kararlarda gereğinden sık onay ister",
      "Opus 5'e göre akıl yürütme tavanı daha düşük",
    ],
    useCases: [
      "Üretimde çalışan ve değişiklik istemeyen ajan sistemleri",
      "Uzun form içerik ve teknik dokümantasyon",
      "Kod incelemesi ve hata ayıklama",
    ],
    docsUrl: "https://platform.claude.com/docs/en/about-claude/models/overview",
    source: ANTHROPIC_SRC,
  },
  {
    slug: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    providerId: "anthropic",
    apiId: "claude-sonnet-5",
    license: "kapali",
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    pricing: {
      input: 3,
      output: 15,
      promo: { input: 2, output: 10, until: "2026-08-31" },
    },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Hız ve zekâ dengesinin en iyi noktası; birçok işte Opus kalitesine Sonnet fiyatına ulaşır.",
    description:
      "Claude Sonnet 5, kod yazımı ve ajan görevlerinde önceki nesle göre büyük bir sıçrama yapar ve pek çok görevde eskiden yalnızca Opus katmanında görülen kaliteye ulaşır. Akıl yürütme varsayılan olarak açıktır. Yeni token'layıcı nedeniyle aynı metin Sonnet 4.6'ya göre yaklaşık %30 daha fazla token'a karşılık gelir — bütçe hesaplarınızı yeniden ölçmeniz gerekir.",
    strengths: [
      "Fiyatına göre olağanüstü kod ve ajan performansı",
      "1 milyon token bağlam ve yüksek çözünürlüklü görsel desteği",
      "En zor işler için `xhigh` çaba seviyesi mevcut",
    ],
    weaknesses: [
      "Yeni token'layıcı aynı metni ~%30 daha fazla token sayar",
      "Talimatları çok harfi yorumlar, kapsamı açıkça belirtmek gerekir",
      "Akıl yürütme kapalıyken araçlara başvurma isteği düşer",
    ],
    useCases: [
      "Günlük kod asistanları ve CI entegrasyonları",
      "Yüksek hacimli sohbet ve destek uygulamaları",
      "Belge özetleme ve yapılandırılmış veri çıkarımı",
    ],
    docsUrl: "https://platform.claude.com/docs/en/about-claude/models/overview",
    source: ANTHROPIC_SRC,
  },
  {
    slug: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    providerId: "anthropic",
    apiId: "claude-sonnet-4-6",
    license: "kapali",
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    pricing: { input: 3, output: 15 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Önceki nesil Sonnet; token davranışı öngörülebilir olduğu için mevcut sistemlerde tercih edilir.",
    description:
      "Claude Sonnet 4.6, Sonnet 5 öncesinin dengeli modelidir. Sonnet 5'in yeni token'layıcısına geçmek istemeyen, maliyet ve bağlam bütçesi hassas ayarlanmış üretim sistemleri için makul bir seçenektir. Uyarlanabilir akıl yürütmeyi destekler ancak açıkça etkinleştirilmesi gerekir.",
    strengths: [
      "Öngörülebilir token sayımı ve maliyet profili",
      "1 milyon token bağlam penceresi",
      "Geniş platform desteği (Bedrock, Vertex, Foundry)",
    ],
    weaknesses: [
      "Sonnet 5'e göre kod ve ajan işlerinde belirgin geride",
      "`xhigh` çaba seviyesi yok",
      "Akıl yürütmeyi açıkça etkinleştirmek gerekir",
    ],
    useCases: [
      "Mevcut üretim hatlarının bakımı",
      "Maliyet tahmini kritik olan toplu işler",
      "Orta zorlukta metin işleme görevleri",
    ],
    docsUrl: "https://platform.claude.com/docs/en/about-claude/models/overview",
    source: ANTHROPIC_SRC,
  },
  {
    slug: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    providerId: "anthropic",
    apiId: "claude-haiku-4-5",
    license: "kapali",
    contextWindow: 200_000,
    maxOutput: 64_000,
    pricing: { input: 1, output: 5 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Anthropic'in en hızlı ve en ucuz modeli; basit, yüksek hacimli görevler için.",
    description:
      "Claude Haiku 4.5, sınıflandırma, etiketleme, kısa özetleme ve basit araç çağrıları gibi gecikmeye duyarlı işler için tasarlanmıştır. 200 bin token bağlam penceresi ile Claude ailesinin en darı, ancak fiyatı en düşük üyesidir. Kendi hız limiti havuzuna sahiptir.",
    strengths: [
      "Claude ailesinin en düşük gecikmesi ve en düşük maliyeti",
      "Yüksek hacimli sınıflandırma ve etiketleme için ideal",
      "Görsel girdi desteği bu fiyat seviyesinde nadir",
    ],
    weaknesses: [
      "200 bin token bağlam — ailenin en darı",
      "Karmaşık akıl yürütme ve çok adımlı ajan işleri için yetersiz",
      "Uyarlanabilir akıl yürütme desteklemez",
    ],
    useCases: [
      "Müşteri mesajlarını kategorilere ayırma",
      "Gerçek zamanlı içerik denetimi",
      "Büyük veri kümelerinde toplu etiketleme",
    ],
    docsUrl: "https://platform.claude.com/docs/en/about-claude/models/overview",
    source: ANTHROPIC_SRC,
  },

  // ------------------------------------------------------------------- OpenAI
  {
    slug: "gpt-5-6-sol",
    name: "GPT-5.6 Sol",
    providerId: "openai",
    apiId: "gpt-5.6-sol",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: { input: 5, output: 30, cachedInput: 0.5 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "OpenAI'ın Temmuz 2026'da genel kullanıma açılan amiral gemisi; en zor görevler için.",
    description:
      "GPT-5.6 Sol, GPT-5.6 ailesinin en güçlü üyesidir ve 9 Temmuz 2026'da genel kullanıma sunulmuştur. Üç katmanın tamamı (Sol, Terra, Luna) 1 milyon token bağlam penceresiyle gelir. Önbellekten okunan girdi standart fiyatın %10'una düşer; toplu işlem API'si ise girdi ve çıktıda düz %50 indirim sağlar.",
    strengths: [
      "En geniş araç, kütüphane ve topluluk ekosistemi",
      "Otomatik istem önbelleklemesi ile %90 girdi tasarrufu",
      "1 milyon token bağlam penceresi",
    ],
    weaknesses: [
      "Çıktı fiyatı ($30) rakiplerine göre yüksek",
      "272 bin token üstü istekler 2 kat girdi, 1,5 kat çıktı ücretlendirilir",
      "Aynı fiyat kademesindeki Terra çoğu iş için yeterli",
    ],
    useCases: [
      "Karmaşık çok adımlı akıl yürütme",
      "Kurumsal ajan sistemleri",
      "Yüksek kaliteli içerik ve analiz üretimi",
    ],
    docsUrl: "https://developers.openai.com/api/docs/pricing",
    source: OPENAI_SRC,
  },
  {
    slug: "gpt-5-6-terra",
    name: "GPT-5.6 Terra",
    providerId: "openai",
    apiId: "gpt-5.6-terra",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: { input: 2.5, output: 15, cachedInput: 0.25 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "GPT-5.6 ailesinin orta katmanı; çoğu üretim yükü için önerilen denge noktası.",
    description:
      "GPT-5.6 Terra, Sol'un yarı fiyatına 1 milyon token bağlam ve aynı özellik setini sunar. OpenAI ekosisteminde üretim iş yükleri için varsayılan tercih olarak konumlanır. Önbelleklenmiş girdi 0,25 $/1M seviyesine iner.",
    strengths: [
      "Fiyat/performans dengesi ailenin en iyisi",
      "Sol ile aynı 1 milyon token bağlam",
      "Ucuz önbellek okuma fiyatı uzun sistem istemleri için ideal",
    ],
    weaknesses: [
      "En zor akıl yürütme görevlerinde Sol'un gerisinde",
      "Çıktı fiyatı Gemini ve DeepSeek muadillerinden yüksek",
      "Uzun bağlam ek ücreti burada da geçerli",
    ],
    useCases: [
      "Üretimdeki sohbet ve asistan uygulamaları",
      "Kod üretimi ve inceleme",
      "Belge işleme hatları",
    ],
    docsUrl: "https://developers.openai.com/api/docs/pricing",
    source: OPENAI_SRC,
  },
  {
    slug: "gpt-5-6-luna",
    name: "GPT-5.6 Luna",
    providerId: "openai",
    apiId: "gpt-5.6-luna",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: { input: 1, output: 6, cachedInput: 0.1 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "GPT-5.6 ailesinin ekonomik katmanı; 1 milyon token bağlamı 1 $ girdi fiyatıyla sunar.",
    description:
      "GPT-5.6 Luna, ailenin en uygun fiyatlı üyesidir ancak bağlam penceresinden ödün vermez — Sol ve Terra ile aynı 1 milyon token'ı sunar. Yüksek hacimli, orta zorluktaki görevler için OpenAI'ın önerdiği ekonomik seçenektir.",
    strengths: [
      "1 milyon token bağlamı çok düşük maliyetle sunar",
      "Önbellek okuma 0,10 $/1M — RAG hatları için çok ucuz",
      "Toplu işlemle birlikte maliyet yarıya iner",
    ],
    weaknesses: [
      "Derin akıl yürütme gerektiren işlerde zayıf",
      "Sol ve Terra'ya göre kod kalitesi düşük",
      "Karmaşık ajan döngülerinde yönlendirme gerektirir",
    ],
    useCases: [
      "Yüksek hacimli özetleme ve sınıflandırma",
      "RAG tabanlı soru-cevap",
      "Ekonomik sohbet arayüzleri",
    ],
    docsUrl: "https://developers.openai.com/api/docs/pricing",
    source: OPENAI_SRC,
  },
  {
    slug: "gpt-5-5",
    name: "GPT-5.5",
    providerId: "openai",
    apiId: "gpt-5.5",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: { input: 5, output: 30, cachedInput: 0.5 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Nisan 2026'da çıkan önceki amiral gemi; GPT-5.6 Sol ile aynı fiyat kademesinde.",
    description:
      "GPT-5.5, Nisan 2026'da yayımlanan genel amaçlı amiral gemisidir. GPT-5.6 Sol ile aynı fiyatlandırmaya sahiptir ve hâlâ aktif olarak sunulmaktadır. Davranışı iyi bilinen ve üzerine istem ayarı yapılmış sistemler için sürüm sabitleme seçeneği olarak değerlidir.",
    strengths: [
      "Olgun ve iyi belgelenmiş davranış",
      "1 milyon token bağlam penceresi",
      "Geniş üçüncü parti araç desteği",
    ],
    weaknesses: [
      "GPT-5.6 Sol aynı fiyata daha güncel",
      "Yüksek çıktı fiyatı",
      "Yeni özellikler öncelikle 5.6 ailesine geliyor",
    ],
    useCases: [
      "Sürüm sabitlemesi gereken üretim sistemleri",
      "Mevcut istem kütüphanelerinin korunması",
      "Genel amaçlı içerik ve analiz",
    ],
    docsUrl: "https://developers.openai.com/api/docs/pricing",
    source: OPENAI_SRC,
  },
  {
    slug: "gpt-5-4",
    name: "GPT-5.4",
    providerId: "openai",
    apiId: "gpt-5.4",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: { input: 2.5, output: 15, cachedInput: 0.25 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Uzun süredir üretimde kullanılan iş beygiri; geniş uyumluluk ve öngörülebilir maliyet.",
    description:
      "GPT-5.4, OpenAI ekosisteminde en yaygın kullanılan üretim modellerinden biridir. GPT-5.6 Terra ile aynı fiyat kademesindedir ve pek çok kütüphane, ajan çerçevesi ve şablon varsayılan olarak bu modeli hedefler.",
    strengths: [
      "En geniş kütüphane ve şablon uyumluluğu",
      "Öngörülebilir maliyet ve davranış",
      "1 milyon token bağlam",
    ],
    weaknesses: [
      "GPT-5.6 Terra aynı fiyata daha güncel",
      "Akıl yürütme derinliği yeni nesle göre sınırlı",
      "Yeni özellik desteği yavaş geliyor",
    ],
    useCases: [
      "Mevcut ajan çerçeveleriyle entegrasyon",
      "Genel amaçlı üretim iş yükleri",
      "Kod ve metin üretimi",
    ],
    docsUrl: "https://developers.openai.com/api/docs/pricing",
    source: OPENAI_SRC,
  },
  {
    slug: "gpt-5-4-mini",
    name: "GPT-5.4 mini",
    providerId: "openai",
    apiId: "gpt-5.4-mini",
    license: "kapali",
    contextWindow: 400_000,
    pricing: { input: 0.75, output: 4.5, cachedInput: 0.075 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Orta hacimli işler için ekonomik seçenek; 400 bin token bağlam sunar.",
    description:
      "GPT-5.4 mini, tam boy modellerin onda birine yakın bir maliyetle çalışır ve 400 bin token bağlam penceresi sunar. Basit araç çağrıları, özetleme ve sınıflandırma gibi görevlerde fiyat/performans açısından güçlüdür.",
    strengths: [
      "Düşük maliyet, makul kalite",
      "400 bin token bağlam bu fiyata iyi",
      "Görsel girdi desteği",
    ],
    weaknesses: [
      "Karmaşık akıl yürütmede zayıf",
      "GPT-5.6 Luna daha geniş bağlam sunuyor",
      "Uzun kod üretiminde tutarlılık düşer",
    ],
    useCases: [
      "Özetleme ve yeniden yazma",
      "Basit araç çağıran asistanlar",
      "Orta hacimli veri işleme",
    ],
    docsUrl: "https://developers.openai.com/api/docs/pricing",
    source: OPENAI_SRC,
  },
  {
    slug: "gpt-5-4-nano",
    name: "GPT-5.4 nano",
    providerId: "openai",
    apiId: "gpt-5.4-nano",
    license: "kapali",
    contextWindow: 400_000,
    pricing: { input: 0.2, output: 1.25, cachedInput: 0.02 },
    inputModalities: ["metin"],
    outputModalities: ["metin"],
    capabilities: ["arac-kullanimi", "onbellekleme", "toplu-islem"],
    summary:
      "OpenAI'ın en ucuz modeli; sınıflandırma ve yönlendirme gibi mikro görevler için.",
    description:
      "GPT-5.4 nano, OpenAI kataloğundaki en düşük maliyetli seçenektir. Niyet sınıflandırma, istek yönlendirme, basit çıkarım ve ön filtreleme gibi tek adımlı görevler için tasarlanmıştır. Önbellek okuma fiyatı 0,02 $/1M ile neredeyse ihmal edilebilir.",
    strengths: [
      "Katalogdaki en düşük maliyet",
      "400 bin token bağlam bu fiyata olağanüstü",
      "Yüksek hacimli işlerde çok düşük gecikme",
    ],
    weaknesses: [
      "Akıl yürütme yeteneği çok sınırlı",
      "Görsel girdi desteklemez",
      "Uzun veya yaratıcı metin üretimine uygun değil",
    ],
    useCases: [
      "Niyet sınıflandırma ve istek yönlendirme",
      "Büyük ajan sistemlerinde ön filtreleme",
      "Basit veri çıkarımı",
    ],
    docsUrl: "https://developers.openai.com/api/docs/pricing",
    source: OPENAI_SRC,
  },
  {
    slug: "gpt-5-4-pro",
    name: "GPT-5.4 Pro",
    providerId: "openai",
    apiId: "gpt-5.4-pro",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: { input: 30, output: 180 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
    ],
    summary:
      "Maliyetin önemsiz, doğruluğun kritik olduğu durumlar için en yüksek hesaplama katmanı.",
    description:
      "GPT-5.4 Pro, istek başına çok daha fazla hesaplama harcayan bir akıl yürütme katmanıdır. Çıktı fiyatı 180 $/1M ile kataloğun en yükseğidir; yalnızca hatanın maliyetinin token maliyetinden çok daha yüksek olduğu senaryolarda mantıklıdır.",
    strengths: [
      "En zor matematik ve akıl yürütme problemlerinde en yüksek isabet",
      "1 milyon token bağlam",
      "Kritik kararlarda doğrulama katmanı olarak kullanılabilir",
    ],
    weaknesses: [
      "Aşırı yüksek fiyat — rutin kullanım için uygun değil",
      "Yüksek gecikme",
      "Önbellek indirimi listelenmiyor",
    ],
    useCases: [
      "Bilimsel ve finansal modelleme doğrulaması",
      "Yüksek riskli kararlarda ikinci görüş",
      "Zor kıyaslama problemleri",
    ],
    docsUrl: "https://developers.openai.com/api/docs/pricing",
    source: OPENAI_SRC,
  },

  // ------------------------------------------------------------------- Google
  {
    slug: "gemini-3-1-pro",
    name: "Gemini 3.1 Pro",
    providerId: "google",
    apiId: "gemini-3.1-pro-preview",
    license: "kapali",
    contextWindow: 2_000_000,
    pricing: {
      input: 2,
      output: 12,
      tiers: [{ over: 200_000, input: 4, output: 18 }],
    },
    inputModalities: ["metin", "gorsel", "ses", "video"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "2 milyon token ile sektörün en geniş bağlam penceresi; video dahil dört kipte girdi alır.",
    description:
      "Gemini 3.1 Pro, 2 milyon token bağlam penceresiyle listedeki en geniş belleğe sahip modeldir. Metin, görsel, ses ve videoyu doğrudan girdi olarak kabul eder — bu, tek başına video analizi gerektiren iş akışları için belirleyici bir avantajdır. 200 bin token'ı aşan istemlerde hem girdi hem çıktı fiyatı yaklaşık iki katına çıkar.",
    strengths: [
      "2 milyon token — kategorisinin en geniş bağlamı",
      "Video ve ses dahil dört kipte doğrudan girdi",
      "Toplu işlem API'sinde %50 indirim",
    ],
    weaknesses: [
      "200 bin token üstünde fiyat iki katına çıkıyor",
      "Ön izleme (preview) sürümü — API'si değişebilir",
      "Ücretsiz katmanda kullanılamaz",
    ],
    useCases: [
      "Uzun video ve toplantı kaydı analizi",
      "Tüm kod tabanını tek istemde inceleme",
      "Çok kipli araştırma ve raporlama",
    ],
    docsUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    source: GOOGLE_SRC,
  },
  {
    slug: "gemini-3-6-flash",
    name: "Gemini 3.6 Flash",
    providerId: "google",
    apiId: "gemini-3.6-flash",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: { input: 1.5, output: 7.5 },
    inputModalities: ["metin", "gorsel", "ses", "video"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Gemini'nin en güncel Flash modeli; 1 milyon bağlam ve çok kipli girdiyi ucuza sunar.",
    description:
      "Gemini 3.6 Flash, Google'ın hız odaklı katmanının en yeni üyesidir. 3.5 Flash ile aynı girdi fiyatına sahiptir ancak çıktı fiyatı daha düşüktür (7,50 $ / 9 $). Ücretsiz katmanda da sınırlı erişim sunar, bu da prototipleme için önemli bir avantajdır.",
    strengths: [
      "Çok kipli girdiyi düşük fiyata sunar",
      "Ücretsiz katman ile hızlı prototipleme",
      "1 milyon token bağlam",
    ],
    weaknesses: [
      "Pro katmanına göre akıl yürütme derinliği sınırlı",
      "Çıktı fiyatı DeepSeek ve Qwen muadillerinden yüksek",
      "Model sürümleri hızlı değişiyor",
    ],
    useCases: [
      "Çok kipli sohbet uygulamaları",
      "Görsel ve ses içerikli belge işleme",
      "Yüksek hacimli üretim yükleri",
    ],
    docsUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    source: GOOGLE_SRC,
  },
  {
    slug: "gemini-3-5-flash",
    name: "Gemini 3.5 Flash",
    providerId: "google",
    apiId: "gemini-3.5-flash",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: { input: 1.5, output: 9 },
    inputModalities: ["metin", "gorsel", "ses", "video"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Yaygın kullanılan önceki nesil Flash; olgun ekosistem ve geniş platform desteği.",
    description:
      "Gemini 3.5 Flash, Google'ın en çok konuşlandırılan modellerinden biridir. 3.6 Flash ile aynı girdi fiyatına sahip olsa da çıktıda biraz daha pahalıdır. Vertex AI üzerinde kurumsal dağıtımı olgunlaşmıştır.",
    strengths: [
      "Olgun ve iyi test edilmiş davranış",
      "Vertex AI'da güçlü kurumsal destek",
      "Çok kipli girdi desteği",
    ],
    weaknesses: [
      "3.6 Flash aynı girdi fiyatına daha ucuz çıktı veriyor",
      "Akıl yürütmede Pro katmanının gerisinde",
      "Uzun bağlamda gecikme artabilir",
    ],
    useCases: [
      "Kurumsal Vertex AI dağıtımları",
      "Çok kipli içerik analizi",
      "Genel amaçlı asistanlar",
    ],
    docsUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    source: GOOGLE_SRC,
  },
  {
    slug: "gemini-3-5-flash-lite",
    name: "Gemini 3.5 Flash-Lite",
    providerId: "google",
    apiId: "gemini-3.5-flash-lite",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: { input: 0.3, output: 2.5 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "gorsel-anlama",
      "arac-kullanimi",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "1 milyon token bağlamı 0,30 $ girdi fiyatıyla sunan ekonomik seçenek.",
    description:
      "Gemini 3.5 Flash-Lite, geniş bağlam penceresini çok düşük bir maliyetle birleştirir. Büyük belge kümelerini tarayan RAG hatları ve yüksek hacimli sınıflandırma işleri için güçlü bir fiyat/bağlam oranı sunar.",
    strengths: [
      "1 milyon token bağlamı çok ucuza sunar",
      "Ücretsiz katman desteği",
      "Yüksek hacimli işlerde düşük gecikme",
    ],
    weaknesses: [
      "Akıl yürütme yeteneği sınırlı",
      "Ses ve video girdisi desteklemez",
      "Karmaşık kod görevlerinde zayıf",
    ],
    useCases: [
      "Büyük belge kümelerinde RAG",
      "Toplu sınıflandırma ve etiketleme",
      "Ekonomik özetleme hatları",
    ],
    docsUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    source: GOOGLE_SRC,
  },
  {
    slug: "gemini-3-1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    providerId: "google",
    apiId: "gemini-3.1-flash-lite",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: {
      input: 0.25,
      output: 1.5,
      note: "Ses girdisi 0,50 $/1M olarak ücretlendirilir",
    },
    inputModalities: ["metin", "gorsel", "ses", "video"],
    outputModalities: ["metin"],
    capabilities: [
      "gorsel-anlama",
      "arac-kullanimi",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Gemini kataloğunun bütçe tabanı; çok kipli girdiyi en düşük fiyata sunar.",
    description:
      "Gemini 3.1 Flash-Lite, Google'ın en uygun fiyatlı güncel modelidir. Metin, görsel ve video girdisi 0,25 $/1M, ses girdisi ise 0,50 $/1M olarak ücretlendirilir. Bu fiyata çok kipli girdi sunan başka bir model bulmak zordur.",
    strengths: [
      "Çok kipli girdiyi kataloğun en düşük fiyatına sunar",
      "1 milyon token bağlam",
      "Ücretsiz katman desteği",
    ],
    weaknesses: [
      "Ses girdisi iki kat ücretlendirilir",
      "Akıl yürütme derinliği düşük",
      "Uzun çıktı üretiminde tutarlılık sorunları",
    ],
    useCases: [
      "Ekonomik görsel ve video etiketleme",
      "Yüksek hacimli çok kipli veri işleme",
      "Prototipleme ve deneysel projeler",
    ],
    docsUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    source: GOOGLE_SRC,
  },

  // ---------------------------------------------------------------------- xAI
  {
    slug: "grok-4-5",
    name: "Grok 4.5",
    providerId: "xai",
    apiId: "grok-4.5",
    license: "kapali",
    contextWindow: 500_000,
    pricing: {
      input: 2,
      output: 6,
      cachedInput: 0.3,
      tiers: [{ over: 200_000, input: 4, output: 12 }],
    },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
    ],
    summary:
      "xAI'ın amiral gemisi; isteğe bağlı X araması ile güncel veriye erişebilir.",
    description:
      "Grok 4.5, xAI'ın güncel amiral gemisidir. Model kendi başına güncel olayları bilmez — bilgisi eğitim verisiyle sınırlıdır (kesim tarihi 1 Şubat 2026). Ayırt edici yanı, sunucu tarafında etkinleştirilebilen X araması aracıdır: açıldığında X gönderilerini, profillerini ve konu başlıklarını sorgulayarak yanıt üretir. Bu araç ayrıca ücretlendirilir (1.000 çağrı başına 5 $). Çıktı fiyatı 6 $/1M ile bu yetenek seviyesindeki rakiplerine göre düşüktür.",
    strengths: [
      "X araması aracı — rakiplerinde doğrudan karşılığı yok",
      "Yetenek seviyesine göre düşük çıktı fiyatı",
      "Yapılandırılabilir akıl yürütme derinliği",
    ],
    weaknesses: [
      "500 bin token bağlam, Grok 4.3'ten dar",
      "Güncel veri için ayrıca ücretli arama aracı gerekir",
      "200 bin token üstünde fiyat ikiye katlanır",
    ],
    useCases: [
      "Sosyal medya izleme ve trend analizi",
      "Güncel olay takibi ve haber özetleme",
      "Marka itibarı analizi",
    ],
    docsUrl: "https://docs.x.ai",
    source: XAI_SRC,
  },
  {
    slug: "grok-4-3",
    name: "Grok 4.3",
    providerId: "xai",
    apiId: "grok-4.3",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: {
      input: 1.25,
      output: 2.5,
      cachedInput: 0.2,
      tiers: [{ over: 200_000, input: 2.5, output: 5 }],
    },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
    ],
    summary:
      "1 milyon token bağlamı 2,50 $ çıktı fiyatıyla sunan çok agresif bir fiyat/performans noktası.",
    description:
      "Grok 4.3, 1 milyon token bağlam penceresini 2,50 $/1M çıktı fiyatıyla birleştirir. Bu, listedeki en iyi bağlam/fiyat oranlarından biridir. Ancak dikkat: istem 200 bin token'ı geçtiğinde fiyat ikiye katlanır, yani asıl uzun bağlam senaryosunda 5 $/1M ödersiniz. Uzun belgelerle çalışan ve bütçesi kısıtlı ekipler için yine de güçlü bir aday. Toplu işlemde ayrıca %20 indirim uygulanır.",
    strengths: [
      "1 milyon bağlamı düşük çıktı fiyatına sunar",
      "İsteğe bağlı X araması aracına erişim",
      "Toplu işlemde %20 indirim",
    ],
    weaknesses: [
      "Grok 4.5'e göre akıl yürütme daha zayıf",
      "200 bin token üstünde fiyat ikiye katlanır",
      "Belgelendirme rakiplerine göre daha az olgun",
    ],
    useCases: [
      "Uzun belge analizi",
      "Bütçe kısıtlı ajan sistemleri",
      "Yüksek hacimli metin üretimi",
    ],
    docsUrl: "https://docs.x.ai",
    source: XAI_SRC,
  },

  // ----------------------------------------------------------------- DeepSeek
  {
    slug: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    providerId: "deepseek",
    apiId: "deepseek-v4-pro",
    license: "kapali",
    contextWindow: 1_000_000,
    maxOutput: 384_000,
    pricing: {
      input: 0.435,
      output: 0.87,
      cachedInput: 0.003625,
      note: "Önbellek isabetinde girdi maliyeti 120 kat düşer",
    },
    inputModalities: ["metin"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
    ],
    summary:
      "Batılı amiral gemilerinin onda biri fiyatına yakın performans sunan Çinli model.",
    description:
      "DeepSeek V4 Pro, 1 milyon token bağlam penceresini 0,435 $ girdi ve 0,87 $ çıktı fiyatıyla sunar — bu, GPT-5.6 Sol'un çıktı fiyatının otuzda birinden azdır. Önbellek isabet fiyatlandırması sektördeki en agresif olanıdır. Maliyet baskısı yüksek projelerde ciddi bir alternatiftir.",
    strengths: [
      "Sektörün en iyi fiyat/performans oranlarından biri",
      "Sektörün en agresif önbellek isabet indirimi",
      "1 milyon token bağlam",
    ],
    weaknesses: [
      "Veriler Çin'de işlenir — KVKK ve kurumsal uyum riski",
      "Görsel girdi desteklemez",
      "Türkçe performansı Batılı muadillerinin gerisinde olabilir",
    ],
    useCases: [
      "Maliyet kritik yüksek hacimli iş yükleri",
      "Kod üretimi ve inceleme",
      "Deneysel ve akademik projeler",
    ],
    docsUrl: "https://api-docs.deepseek.com",
    source: DEEPSEEK_SRC,
  },
  {
    slug: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    providerId: "deepseek",
    apiId: "deepseek-v4-flash",
    license: "kapali",
    contextWindow: 1_000_000,
    maxOutput: 384_000,
    pricing: {
      input: 0.14,
      output: 0.28,
      cachedInput: 0.0028,
      note: "Önbellek isabetinde girdi maliyeti 50 kat düşer",
    },
    inputModalities: ["metin"],
    outputModalities: ["metin"],
    capabilities: ["arac-kullanimi", "kod", "uzun-baglam", "onbellekleme"],
    summary:
      "1 milyon token bağlamı 0,28 $ çıktı fiyatıyla sunan, kataloğun en ucuz hızlı modeli.",
    description:
      "DeepSeek V4 Flash, V4 Pro'nun hız ve maliyet odaklı sürümüdür. 1 milyon token bağlamı 0,14 $ girdi ve 0,28 $ çıktı fiyatıyla sunar. Ölçek ekonomisinin belirleyici olduğu, milyonlarca istek işleyen sistemlerde tercih edilir.",
    strengths: [
      "Kapalı modeller arasında en düşük maliyetlerden biri",
      "1 milyon token bağlam",
      "Çok yüksek istek hacmini kaldırabilir",
    ],
    weaknesses: [
      "Veri Çin'de işlenir — uyumluluk riski",
      "Akıl yürütme sınırlı",
      "Çok kipli girdi yok",
    ],
    useCases: [
      "Milyonlarca istekli üretim sistemleri",
      "Ekonomik özetleme ve çeviri",
      "Toplu veri işleme",
    ],
    docsUrl: "https://api-docs.deepseek.com",
    source: DEEPSEEK_SRC,
  },

  // --------------------------------------------------------------------- Meta
  {
    slug: "llama-4-scout",
    name: "Llama 4 Scout",
    providerId: "meta",
    apiId: "meta-llama/Llama-4-Scout",
    license: "acik-agirlik",
    contextWindow: 10_000_000,
    pricing: null,
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "ince-ayar",
      "yerel-calisma",
    ],
    summary:
      "10 milyon token bağlamlı açık ağırlıklı model; ağırlıklarını indirip kendi sunucunuzda çalıştırabilirsiniz.",
    description:
      "Llama 4 Scout, 10 milyon token ile listedeki en geniş bağlam penceresine sahip modeldir ve ağırlıkları açıktır. Token başına ücret ödemezsiniz; bunun yerine GPU altyapı maliyetini üstlenirsiniz. Verinin kurum dışına çıkmaması gereken senaryolarda belirleyici avantaj sağlar.",
    strengths: [
      "10 milyon token — listedeki en geniş bağlam penceresi",
      "Veri tamamen kendi altyapınızda kalır (KVKK uyumu kolay)",
      "Token başına ücret yok, ince ayar yapılabilir",
    ],
    weaknesses: [
      "GPU altyapısı gerekir — saatlik 0,50-5 $ arası bulut maliyeti",
      "Ölçekleme, izleme ve bakım sizin sorumluluğunuzda",
      "Kapalı amiral gemilerinin akıl yürütme seviyesinin gerisinde",
    ],
    useCases: [
      "Veri egemenliği zorunlu kurumsal dağıtımlar",
      "Alan odaklı ince ayar projeleri",
      "Devasa bağlam gerektiren araştırma çalışmaları",
    ],
    docsUrl: "https://www.llama.com",
    source: META_SRC,
  },
  {
    slug: "llama-4-maverick",
    name: "Llama 4 Maverick",
    providerId: "meta",
    apiId: "meta-llama/Llama-4-Maverick",
    license: "acik-agirlik",
    contextWindow: 1_000_000,
    parameters: 400,
    pricing: null,
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "ince-ayar",
    ],
    summary:
      "400 milyar parametreli açık ağırlıklı amiral gemi; en güçlü açık modellerden biri.",
    description:
      "Llama 4 Maverick, Meta'nın 400 milyar parametreli açık ağırlıklı modelidir ve 1 milyon token bağlam sunar. Scout'a göre daha güçlü akıl yürütme yeteneğine sahiptir ancak çalıştırmak için çok daha fazla GPU belleği gerektirir. Sunucusuz sağlayıcılar üzerinden yaklaşık 0,27 $ / 0,85 $ fiyatlarla da erişilebilir.",
    strengths: [
      "Açık modeller arasında en güçlü akıl yürütmelerden biri",
      "İnce ayar ve tam özelleştirme imkânı",
      "Birden fazla barındırma sağlayıcısı arasında seçim yapabilirsiniz",
    ],
    weaknesses: [
      "400B parametre — ciddi GPU yatırımı gerektirir",
      "Kendi barındırmanız hâlinde işletme yükü yüksek",
      "En güncel kapalı modellerin gerisinde",
    ],
    useCases: [
      "Kurum içi özel model dağıtımları",
      "Alan uzmanlığı için ince ayar",
      "Sağlayıcı bağımlılığından kaçınmak isteyen projeler",
    ],
    docsUrl: "https://www.llama.com",
    source: META_SRC,
  },

  // ------------------------------------------------------------------ Mistral
  {
    slug: "mistral-large-3",
    name: "Mistral Large 3",
    providerId: "mistral",
    apiId: "mistral-large-2512",
    license: "acik-agirlik",
    contextWindow: 256_000,
    pricing: { input: 0.5, output: 1.5 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "onbellekleme",
    ],
    summary:
      "Avrupa merkezli amiral gemi; GDPR/KVKK uyumu ve veri egemenliği önceliği olan kurumlar için.",
    description:
      "Mistral Large 3, Fransa merkezli Mistral AI'ın amiral gemisidir. Teknik özelliklerinden çok konumlanmasıyla öne çıkar: veriler Avrupa'da işlenir, bu da GDPR ve KVKK uyumluluğunu ABD ve Çin merkezli sağlayıcılara göre çok daha basit hâle getirir. 0,50 $ / 1,50 $ fiyatlandırması bu kalite seviyesi için rekabetçidir.",
    strengths: [
      "Avrupa'da veri işleme — GDPR/KVKK uyumu kolay",
      "Kalite seviyesine göre çok rekabetçi fiyat",
      "Kurumsal dağıtım ve şirket içi kurulum seçenekleri",
    ],
    weaknesses: [
      "256 bin token bağlam — 1M sunan rakiplerinin gerisinde",
      "Akıl yürütmede en üst kademe modellerin altında",
      "Ekosistem ABD'li sağlayıcılara göre küçük",
    ],
    useCases: [
      "KVKK/GDPR hassasiyeti olan kurumsal uygulamalar",
      "Kamu ve finans sektörü projeleri",
      "Avrupa dilleri ağırlıklı içerik işleme",
    ],
    docsUrl: "https://docs.mistral.ai",
    source: MISTRAL_LARGE_SRC,
  },
  {
    slug: "mistral-small-4",
    name: "Mistral Small 4",
    providerId: "mistral",
    apiId: "mistral-small-2603",
    license: "acik-agirlik",
    contextWindow: 256_000,
    pricing: { input: 0.15, output: 0.6 },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: ["gorsel-anlama", "arac-kullanimi", "kod", "onbellekleme"],
    summary:
      "Mistral'ın ekonomik katmanı; Avrupa veri işleme garantisini düşük maliyetle birleştirir.",
    description:
      "Mistral Small 4, Large 3 ile aynı 256 bin token bağlamı çok daha düşük bir fiyata sunar. Avrupa'da veri işleme avantajını korurken maliyet duyarlı iş yüklerine hitap eder. Yüksek hacimli sınıflandırma ve özetleme için uygun bir denge noktasıdır.",
    strengths: [
      "Düşük maliyetle Avrupa veri işleme garantisi",
      "256 bin token bağlam bu fiyata iyi",
      "Görsel girdi desteği",
    ],
    weaknesses: [
      "Karmaşık akıl yürütmede zayıf",
      "DeepSeek ve Qwen muadilleri daha ucuz",
      "Uzun bağlam gerektiren işlere uygun değil",
    ],
    useCases: [
      "Uyumluluk gerektiren yüksek hacimli işler",
      "Kurumsal belge sınıflandırma",
      "Ekonomik özetleme hatları",
    ],
    docsUrl: "https://docs.mistral.ai",
    source: MISTRAL_SMALL_SRC,
  },

  // ------------------------------------------------------------------ Alibaba
  {
    slug: "qwen-3-7-plus",
    name: "Qwen3.7 Plus",
    providerId: "alibaba",
    apiId: "qwen3.7-plus",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: {
      input: 0.4,
      output: 1.6,
      tiers: [{ over: 256_000, input: 1.2, output: 4.8 }],
      // İndirimin ne zaman biteceği açıklanmadığı için `promo` olarak
      // yapılandırılamıyor: `until` alanına yazacak doğrulanmış bir tarih yok.
      note: "Liste fiyatına şu anda geçici %20 indirim uygulanıyor",
    },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "akil-yurutme",
      "gorsel-anlama",
      "arac-kullanimi",
      "kod",
      "uzun-baglam",
      "onbellekleme",
    ],
    summary:
      "Alibaba'nın dengeli katmanı; 1 milyon bağlam ve tam araç desteğini düşük fiyatla birleştirir.",
    description:
      "Qwen3.7 Plus, Alibaba'nın dengeli katmanıdır ve sağlayıcının kendi karşılaştırma tablosunda GPT-5.4, Claude Sonnet 4.6 ve Gemini 3 Pro'nun muadili olarak konumlandırılır. 1 milyon token bağlam penceresini tam araç çağırma desteğiyle sunar; Alibaba onu sohbet botları, içerik üretimi, özetleme ve belge işleme için başlangıç noktası olarak önerir. Fiyatın 256 bin token üstünde üç katına çıktığını hesaba katın — asıl uzun bağlam senaryosunda maliyet 1,20 $ / 4,80 $ olur.",
    strengths: [
      "1 milyon bağlamı tam araç desteğiyle düşük fiyata sunar",
      "Alibaba'nın kendi eşleştirmesinde Sonnet/Gemini Pro katmanında",
      "Bağlam önbelleklemede indirim uygulanır",
    ],
    weaknesses: [
      "256 bin token üstünde fiyat üç katına çıkar",
      "Veri Çin'de işlenir — uyumluluk riski",
      "Türkçe performansı için ayrı test gerekir",
    ],
    useCases: [
      "Çok dilli içerik üretimi ve özetleme",
      "Büyük kod tabanlarında ajan destekli çalışma",
      "Maliyet duyarlı uzun bağlam işleri",
    ],
    docsUrl: "https://www.alibabacloud.com/help/en/model-studio/text-generation-model/",
    source: ALIBABA_SRC,
  },
  {
    slug: "qwen-3-7-flash",
    name: "Qwen3.7 Flash",
    providerId: "alibaba",
    apiId: "qwen3.7-flash",
    license: "kapali",
    contextWindow: 1_000_000,
    pricing: {
      input: 0.03,
      output: 0.13,
      tiers: [
        { over: 32_000, input: 0.1, output: 0.4 },
        { over: 256_000, input: 0.2, output: 0.8 },
      ],
    },
    inputModalities: ["metin", "gorsel"],
    outputModalities: ["metin"],
    capabilities: [
      "arac-kullanimi",
      "gorsel-anlama",
      "uzun-baglam",
      "onbellekleme",
      "toplu-islem",
    ],
    summary:
      "Kısa istemlerde listedeki en ucuz model; fiyat istem uzadıkça üç kademede yükselir.",
    description:
      "Qwen3.7 Flash, Alibaba'nın hafif ve düşük maliyetli katmanıdır; sağlayıcının kendi eşleştirmesinde GPT-5.4-mini, Claude Haiku 4.5 ve Gemini 3.1 Flash ile aynı gruptadır. Fiyatlandırması üç kademelidir ve bu modeli değerlendirirken en kritik nokta budur: 32 bin token'a kadar 0,03 $ / 0,13 $ ile listenin en ucuzudur, ancak 1 milyon token'lık bir istemde 0,20 $ / 0,80 $ öder — yani yaklaşık altı katı. Kısa ve yüksek hacimli isteklerde çok verimli, uzun bağlamda ise avantajı belirgin biçimde azalır. Toplu işlemde ayrıca %50 indirim uygulanır.",
    strengths: [
      "Kısa istemlerde listedeki en düşük fiyat",
      "1 milyon bağlam ve görsel girdi desteği",
      "Toplu işlemde %50, önbelleklemede ek indirim",
    ],
    weaknesses: [
      "Fiyat üç kademede yükselir — uzun bağlamda ucuzluğu kaybolur",
      "Akıl yürütme yeteneği Plus katmanının gerisinde",
      "Veri Çin'de işlenir",
    ],
    useCases: [
      "Yüksek hacimli kısa istekler ve sınıflandırma",
      "Ekonomik görsel etiketleme",
      "Maliyet duyarlı çeviri ve özetleme",
    ],
    docsUrl: "https://www.alibabacloud.com/help/en/model-studio/text-generation-model/",
    source: ALIBABA_SRC,
  },

  // -------------------------------------------------------------------- VNGRS
  {
    slug: "kumru-7b",
    name: "Kumru 7B",
    providerId: "vngrs",
    apiId: "vngrs-ai/Kumru-7B",
    license: "acik-agirlik",
    contextWindow: 8_192,
    parameters: 7.4,
    pricing: null,
    inputModalities: ["metin"],
    outputModalities: ["metin"],
    capabilities: ["ince-ayar", "yerel-calisma"],
    summary:
      "Sıfırdan Türkçe veriyle eğitilen ilk yerli büyük dil modeli; 16 GB VRAM'de çalışır.",
    description:
      "Kumru, VNGRS tarafından geliştirilen ve tamamen Türkçe veriyle sıfırdan eğitilen ilk büyük dil modelidir. 7,4 milyar parametreye sahiptir ve 500 GB temizlenmiş Türkçe veriyle 45 gün boyunca, 300 milyar token üzerinden ön eğitim almıştır. Mimarisi Mistral-v0.3 tabanlıdır. Türkçeye özel token'layıcısı sayesinde çok dilli modellere göre aynı Türkçe metni çok daha az token'la işler — bu, hem hız hem maliyet avantajı demektir. RTX 3090 veya RTX A4000 gibi 16 GB VRAM'li tek bir ekran kartında çalışabilir. Bilgi kesim tarihi Mart 2024'tür.",
    strengths: [
      "Türkçeye özel token'layıcı ile çok dilli modellerden belirgin daha verimli",
      "16 GB VRAM'li tek GPU'da çalışır — düşük donanım maliyeti",
      "Veri tamamen kurum içinde kalır, KVKK uyumu en kolay seçenek",
    ],
    weaknesses: [
      "8.192 token bağlam — yaklaşık 20 A4 sayfası, listedeki en dar pencere",
      "Bilgi kesim tarihi Mart 2024, güncel olaylardan habersiz",
      "Genel yetenek olarak uluslararası amiral gemilerin çok gerisinde",
    ],
    useCases: [
      "Türkçe kurumsal belge işleme ve özetleme",
      "Kurum içi SSS ve arama sistemleri",
      "Verinin yurt dışına çıkamayacağı kamu projeleri",
    ],
    docsUrl: "https://huggingface.co/vngrs-ai",
    source: KUMRU_SRC,
  },
  {
    slug: "kumru-2b",
    name: "Kumru 2B",
    providerId: "vngrs",
    apiId: "vngrs-ai/Kumru-2B",
    license: "acik-agirlik",
    contextWindow: 8_192,
    parameters: 2,
    pricing: null,
    inputModalities: ["metin"],
    outputModalities: ["metin"],
    capabilities: ["ince-ayar", "yerel-calisma"],
    summary:
      "Kumru'nun küçük açık kaynak sürümü; dizüstü bilgisayarda bile çalışabilecek kadar hafif.",
    description:
      "Kumru 2B, Kumru ailesinin Hugging Face üzerinden açık kaynak olarak yayımlanan küçük sürümüdür. Model boyutu dışında 7B sürümüyle aynı teknik özelliklere sahiptir: 8.192 token bağlam uzunluğu ve 300 milyar token ön eğitim. Ollama ve LM Studio üzerinden kişisel bilgisayarlarda kolayca çalıştırılabilir.",
    strengths: [
      "Çok düşük donanım gereksinimi, dizüstü bilgisayarda çalışır",
      "Ollama ve LM Studio ile kurulumu birkaç dakika",
      "Tamamen çevrimdışı ve ücretsiz kullanım",
    ],
    weaknesses: [
      "2 milyar parametre — yetenek olarak oldukça sınırlı",
      "8.192 token bağlam",
      "Karmaşık akıl yürütme ve kod görevlerine uygun değil",
    ],
    useCases: [
      "Yerel Türkçe metin işleme denemeleri",
      "Eğitim ve öğrenme amaçlı projeler",
      "Çevrimdışı çalışması gereken basit uygulamalar",
    ],
    docsUrl: "https://huggingface.co/vngrs-ai",
    source: KUMRU_SRC,
  },
];

export const modelMap = new Map(models.map((m) => [m.slug, m]));

export function getModel(slug: string): Model | undefined {
  return modelMap.get(slug);
}
