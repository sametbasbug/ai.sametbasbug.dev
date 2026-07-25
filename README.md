# Equinox Model Atlası

Türkçe yapay zekâ modeli keşif ve karşılaştırma sitesi. Kullanıcılar modelleri
sağlayıcı, yetenek, lisans ve bağlam penceresine göre filtreler; dörde kadar
modeli yan yana karşılaştırır; her model için Türkçe bir detay sayfası okur.

Site, Samet Başbuğ'un [Equinox](https://equinox.sametbasbug.dev) ekosistemindeki
yayın yüzeylerinden biridir.

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
    hakkinda/page.tsx        Site, veri politikası ve ekosistem bağı
    icon.svg                 Favicon (Equinox işareti)
    opengraph-image.png      Paylaşım görseli — üretilmiş, depoya işlenir
    apple-icon.png           iOS ana ekran simgesi — üretilmiş
  components/
    ModelExplorer.tsx        Arama, filtreler, kart ızgarası, seçim çubuğu
    ModelCard.tsx            Tek model kartı
    CompareView.tsx          Karşılaştırma tablosu ve model ekleme
    EquinoxMark.tsx          Marka işareti (başlık, altbilgi, hakkında)
    ui.tsx                   Badge, ProviderTag, Stat
  data/
    types.ts                 Model ve Provider tipleri
    models.ts                ⭐ Tüm model verisi burada
    providers.ts             Sağlayıcı bilgileri
  lib/
    brand.ts                 Equinox ad ve adres sabitleri
    constants.ts             MAX_COMPARE, SITE_URL
    format.ts                tr-TR sayı, fiyat ve tarih biçimlendirme
    labels.ts                Yetenek/kip/lisans Türkçe etiketleri
tools/brand/                 OG görseli ve Apple simgesinin üreteç kaynakları
scripts/build-brand-images.sh  Bu görselleri yeniden üretir
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

## Marka

Görsel kimlik ekosistemden **devralınmadı**, yalnızca marka bağı taşındı.
Equinox'un kendi sayfası koyu ve atmosferiktir; Model Atlası ise fiyat sütunları
ve karşılaştırma tabloları olan veri yoğun bir sitedir. Ortak olan işaret, altın
vurgu ve ad kilidi — zemin paleti değil.

Ekosistem bağının durduğu yerler:

- **İşaret** — güneş/ay tutulması ve iki yörünge yayı. Geometri
  `equinox.sametbasbug.dev`'deki işaretle aynıdır; tek fark alttaki yayın rengi
  (hub'da menekşe, burada sitenin kendi vurgu tonu) — böylece sekmede hub'la
  karışmaz. Aynı çizim dört yerde durur: [EquinoxMark.tsx](src/components/EquinoxMark.tsx),
  `app/icon.svg` ve `tools/brand/` altındaki iki üreteç. Biri değişirse hepsi
  değişmeli.
- **Ad kilidi** — başlıkta "EQUINOX" üstte küçük ve altın, "Model Atlası" altta
  baskın. Tam ad `SITE_NAME` sabitindedir ve tüm başlık/OG etiketlerini besler.
- **Renkler** — Equinox altın/camgöbeği değerleri `globals.css` içinde
  `--eq-*` belirteçleri olarak durur ve yalnızca marka yüzeylerinde kullanılır.

Adlar ve adresler tek bir yerde: [src/lib/brand.ts](src/lib/brand.ts).

### Marka görsellerini yeniden üretmek

Paylaşım görseli ve iOS simgesi depoya **statik PNG olarak işlenir**, her
derlemede üretilmez. Değiştirmek için `tools/brand/` altındaki kaynağı düzenleyip:

```bash
./scripts/build-brand-images.sh
```

Betiğin ne yaptığı ve neden gerektiği kendi başlığında açıklanmıştır; özeti
"Bilinçli tasarım kararları" bölümündedir. Üretilen PNG'ler depoya işlenmelidir.

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
| xAI | `docs.x.ai/docs/pricing` |
| DeepSeek | `api-docs.deepseek.com/quick_start/pricing` |
| Mistral | `docs.mistral.ai` model kartları (model başına ayrı) |
| Alibaba | `alibabacloud.com/help/en/model-studio/model-pricing` |
| Meta | `llama.com/docs/model-cards-and-prompt-formats/llama4/` |
| VNGRS (Kumru) | `medium.com/vngrs/kumru-llm-34d1628cfd93` |

**Katalogdaki her modelin verisi sağlayıcının kendi resmî sayfasından
doğrulanmıştır.** Üçüncü parti toplayıcı kullanılmamaktadır; bu kural yeni model
eklerken de korunmalıdır. Sağlayıcının kendi sayfasında bulamadığınız bir modeli
toplayıcıdan alıp eklemeyin — bulunamıyor olması genellikle modelin emekliye
ayrıldığı anlamına gelir.

Nitekim ilk doğrulama turunda Grok 4.1 Fast bu şekilde katalogdan çıkarıldı:
xAI'ın fiyat sayfasında ve model dokümantasyonunda yer almıyordu.

Bazı modellerin `maxOutput` değeri resmî sayfada belirtilmediği için boş
bırakılmıştır ve arayüzde "—" olarak görünür. Tahmin yazmak yerine boş bırakmak
tercih edilmiştir.

### Kademeli fiyatlandırma

Bazı sağlayıcılar istem uzunluğuna göre farklı fiyat uygular ve veri modeli tek
bir girdi/çıktı fiyatı tuttuğu için bunu doğrudan ifade edemez:

- **xAI** — istem 200 bin token'ı aştığında *tüm* token'lar iki katı
  ücretlendirilir.
- **Alibaba** — Qwen3.7 Plus'ta 256 bin token üstünde fiyat üç katına çıkar;
  Qwen3.7 Flash'ta üç kademe vardır (32 bin ve 256 bin sınırlarında).

Bu durumlarda **taban katman** fiyatı gösterilir ve istisna `pricing.note`
alanına yazılır; not hem karşılaştırma tablosunda hem detay sayfasında görünür.
Yeni bir model eklerken sağlayıcının kademeli fiyatı olup olmadığına bakın —
yalnızca taban fiyatı yazmak uzun bağlam senaryosunda kullanıcıyı yanıltır.

**Bilinen sınırlama:** ana sayfadaki "en düşük çıktı fiyatı" istatistiği taban
katmanları karşılaştırır. Şu anda Qwen3.7 Flash'ı (0,13 $, yalnızca 32 bin
token'a kadar) DeepSeek V4 Flash'ın önüne koyuyor (0,28 $, 1 milyona kadar sabit).
Bunu düzgün çözmek `pricing` alanına yapısal bir kademe listesi eklemeyi
gerektirir; maliyet hesaplayıcı yapılırken ele alınmak üzere ertelendi.

### Lisans ile fiyat birbirinden bağımsızdır

"Açık ağırlıklı" bir modelin barındırılan API fiyatı olabilir. Mistral Large 3
ve Mistral Small 4 hem açık ağırlıklıdır hem de Mistral'ın kendi API'sinde
ücretlidir; Llama 4 modellerinde ise bir fiyat yazılmamıştır çünkü Meta
barındırma sunmaz. `license` alanını fiyatın varlığına bakarak doldurmayın.

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
- **OG görseli üreteç değil, statik dosya.** `opengraph-image.tsx` `src/app/`
  altında dursaydı Next onu her derlemede **uzantısız** bir rota
  (`out/opengraph-image`) olarak üretirdi. GitHub Pages içerik tipini dosya
  uzantısından belirlediği için bu dosya `application/octet-stream` olarak
  sunulur ve paylaşım önizlemeleri onu görsel saymaz. Üreteçler bu yüzden
  `tools/brand/` altında tutulur, çıktı PNG olarak depoya işlenir ve
  `out/opengraph-image.png` doğru içerik tipiyle yayına çıkar. Görselde model
  sayısı gibi veriyle değişen bir bilgi de bu yüzden yok — statik bir dosya
  katalog büyüdükçe bayatlardı.
- **Marka adı CSS ile büyütülmez.** Belge `lang="tr"` olduğu için tarayıcı
  `text-transform: uppercase` uygularken Türkçe kuralını izler ve `i` harfini
  noktalı `İ` yapar: "Equinox" → "EQUİNOX". Türkçe sözcükler için doğru olan bu
  davranış marka adı için yanlış olduğundan büyük harfli biçim `brand.ts`
  içinde harfi harfine yazılıdır. Sayfa içindeki Türkçe üst başlıklar
  (`TÜRKÇE YAPAY ZEKÂ MODEL REHBERİ`) CSS ile büyütülmeye devam eder — orada
  noktalı `İ` istenen sonuçtur.

## Yapılmayanlar

İlk sürümde bilinçli olarak kapsam dışı bırakılanlar:

- Maliyet hesaplayıcı (aylık token kullanımından TL/USD tahmini)
- Canlı fiyat çekme veya CMS entegrasyonu
- Kıyaslama (benchmark) skorları
