# Model Atlası

Türkçe yapay zekâ modeli keşif ve karşılaştırma sitesi. Kullanıcılar modelleri
sağlayıcı, yetenek, lisans ve bağlam penceresine göre filtreler; dörde kadar
modeli yan yana karşılaştırır; her model için Türkçe bir detay sayfası okur.

## Çalıştırma

```bash
npm run dev
```

Üretim derlemesi:

```bash
npm run build
```

Canlı: **https://ai.sametbasbug.dev**

## Teknoloji

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- Veri, repodaki bir TypeScript dosyasında tutulur — çalışma zamanında veritabanı
  veya harici API yok. Tüm site derleme sırasında statik HTML'e dökülür
  (`output: "export"`), GitHub Pages üzerinden sunulur.

## Yayınlama

`main` dalına her push, [deploy.yml](.github/workflows/deploy.yml) iş akışını
tetikler: `npm ci` → `npm run lint` → `npm run build` → `out/` klasörünü GitHub
Pages'e yükler. Lint veya derleme hata verirse yayın yapılmaz.

Elle tetiklemek için: GitHub → Actions → "Deploy to GitHub Pages" → Run workflow.

Alan adı `public/CNAME` dosyasında tutulur. DNS tarafında `ai.sametbasbug.dev`
için bir `CNAME` kaydı `sametbasbug.github.io` adresini göstermelidir.

Alan adı değişirse iki yeri güncelleyin: `public/CNAME` ve `SITE_URL`
([src/lib/constants.ts](src/lib/constants.ts)). Kanonik bağlantılar, Open Graph
etiketleri, `sitemap.xml` ve `robots.txt` `SITE_URL`'den üretilir.

Statik çıktıyı yayınlamadan önce yerelde denemek için:

```bash
npm run build
python3 -m http.server 4000 --directory out
```

## Dizin yapısı

```
src/
  app/
    page.tsx                 Ana sayfa: hero + filtrelenebilir model listesi
    modeller/[slug]/page.tsx Model detay sayfası (statik üretilir)
    karsilastir/page.tsx     Karşılaştırma sayfası (?m=slug&m=slug)
    saglayicilar/page.tsx    Sağlayıcı özetleri
  components/
    ModelExplorer.tsx        Arama, filtreler, kart ızgarası, seçim çubuğu
    ModelCard.tsx            Tek model kartı
    CompareView.tsx          Karşılaştırma tablosu ve model ekleme
    ui.tsx                   Badge, ProviderTag, Stat
  data/
    types.ts                 Model ve Provider tipleri
    models.ts                ⭐ Tüm model verisi burada
    providers.ts             Sağlayıcı bilgileri
  lib/
    constants.ts             MAX_COMPARE
    format.ts                tr-TR sayı, fiyat ve tarih biçimlendirme
    labels.ts                Yetenek/kip/lisans Türkçe etiketleri
```

## Yeni model ekleme

`src/data/models.ts` dosyasına bir nesne ekleyin. Zorunlu alanlar `types.ts`
içinde tanımlıdır; TypeScript eksik alanı derleme sırasında yakalar.

```ts
{
  slug: "ornek-model-1",              // URL'de görünür, benzersiz olmalı
  name: "Örnek Model 1",
  providerId: "openai",               // providers.ts içindeki bir kimlik
  apiId: "ornek-model-1",             // API çağrılarındaki gerçek kimlik
  license: "kapali",                  // veya "acik-agirlik"
  contextWindow: 1_000_000,           // token
  maxOutput: 128_000,                 // isteğe bağlı
  pricing: { input: 2.5, output: 15 },// açık ağırlıklı modellerde `null`
  inputModalities: ["metin", "gorsel"],
  outputModalities: ["metin"],
  capabilities: ["akil-yurutme", "kod"],
  summary: "Tek cümlelik özet.",
  description: "Detay sayfasındaki uzun açıklama.",
  strengths: ["…"],
  weaknesses: ["…"],
  useCases: ["…"],
  docsUrl: "https://…",
  source: { url: "https://…", verifiedAt: "2026-07-25" },
}
```

Detay sayfası, ana sayfa listesi ve karşılaştırma seçicisi otomatik olarak
güncellenir; başka bir yeri elle değiştirmeniz gerekmez.

Yeni bir sağlayıcı ekliyorsanız önce `src/data/providers.ts` dosyasına kaydını
ve `ProviderId` birleşim tipine kimliğini ekleyin.

## Veri bakımı

Fiyatlar ve model kimlikleri sık değişir. Her modelin `source` alanında verinin
nereden ve **hangi tarihte** alındığı yazılıdır; bu bilgi detay sayfasının
altında kullanıcıya da gösterilir.

Bu depodaki veri **25 Temmuz 2026** tarihinde şu kaynaklardan derlenmiştir:

| Sağlayıcı | Kaynak |
| --- | --- |
| Anthropic | `platform.claude.com/docs/en/about-claude/models/overview` |
| OpenAI | `developers.openai.com/api/docs/pricing` |
| Google | `ai.google.dev/gemini-api/docs/pricing` |
| xAI, DeepSeek, Meta, Mistral, Alibaba | `benchlm.ai/llm-pricing` (toplayıcı) |
| VNGRS (Kumru) | `medium.com/vngrs/kumru-llm-34d1628cfd93` |

Anthropic, OpenAI ve Google verileri sağlayıcının kendi resmî sayfasından
doğrulanmıştır. Diğer sağlayıcılar için üçüncü parti bir toplayıcı
kullanılmıştır; bunları resmî fiyat sayfalarından teyit etmek listedeki ilk
iyileştirme adımıdır.

Bazı modellerin `maxOutput` değeri resmî sayfada belirtilmediği için boş
bırakılmıştır ve arayüzde "—" olarak görünür. Tahmin yazmak yerine boş bırakmak
tercih edilmiştir.

## Bilinçli tasarım kararları

- **Karşılaştırma seçimi URL'de tutulur** (`/karsilastir?m=a&m=b`). Böylece bir
  karşılaştırma bağlantısı olduğu gibi paylaşılabilir.
- **Binlik kısaltma "K"**, "B" değil. Türkçe okuyucu "B"yi "bin", İngilizce
  okuyucu "billion" olarak okuyabildiği için belirsizdi.
- **Sayılarda daktilo fontu yerine `tabular-nums`**. Sabit genişlikli fontta
  ondalık ayırıcı tam karakter genişliği kapladığı için "0,28 $" seyrek
  görünüyordu; `tabular-nums` hizalamayı bozmadan bunu çözer.
- **`MAX_COMPARE` sabiti `lib/constants.ts` içinde**, istemci bileşeninde değil.
  `"use client"` işaretli bir modülden dışa aktarılan değer sunucu bileşenine
  gerçek sayı olarak değil, bir istemci referansı olarak geçiyor ve sessizce
  yanlış sonuç üretiyor.
- **Geist fontları `latin-ext` alt kümesiyle** yükleniyor; `ğ`, `ı`, `İ` ve `ş`
  karakterleri yalnızca `latin` alt kümesinde yer almıyor.
- **Karşılaştırma sayfası URL'i `history.replaceState` ile günceller**, Next
  yönlendiricisiyle değil. Statik dışa aktarımda `router.replace` sessizce
  hiçbir şey yapmıyor — ne adres ne bileşen güncelleniyor. `history.replaceState`
  Next'in desteklediği yol: adresi değiştirir ve `useSearchParams`'ı tetikler.
- **`trailingSlash: true`.** Her rota `dizin/index.html` olarak üretilir; statik
  barındırmada uzantısız adreslerin çözümü bu şekilde garanti altına alınır.
  Sayfa içi bağlantılar da bu yüzden `/karsilastir/?m=…` biçiminde yazılır.

## Yapılmayanlar

İlk sürümde bilinçli olarak kapsam dışı bırakılanlar:

- Maliyet hesaplayıcı (aylık token kullanımından TL/USD tahmini)
- Canlı fiyat çekme veya CMS entegrasyonu
- Kıyaslama (benchmark) skorları
