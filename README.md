# Equinox Model Atlası

Türkçe yapay zekâ modeli keşif ve karşılaştırma sitesi. Kullanıcılar modelleri
sağlayıcı, yetenek, lisans ve bağlam penceresine göre filtreler; dörde kadar
modeli yan yana karşılaştırır; her model için Türkçe bir detay sayfası okur.

Site, Samet Başbuğ'un [Equinox](https://equinox.sametbasbug.dev) ağındaki
ürünlerden biridir.

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
    hesaplayici/page.tsx     Maliyet hesaplayıcı
    saglayicilar/page.tsx    Sağlayıcı özetleri
    hakkinda/page.tsx        Site, veri politikası ve ekosistem bağı
    icon.svg                 Küçük ölçekte sadeleştirilmiş ürün favicon'u
    opengraph-image.png      Paylaşım görseli — üretilmiş, depoya işlenir
    apple-icon.png           iOS ana ekran simgesi — üretilmiş
  components/
    ModelExplorer.tsx        Arama, filtreler, görünüm geçişi, seçim çubuğu
    ModelList.tsx            Yoğun liste görünümü (varsayılan)
    ModelCard.tsx            Kart görünümündeki tek model kartı
    CompareView.tsx          Karşılaştırma tablosu ve model ekleme
    CostCalculator.tsx       Maliyet hesaplayıcının formu ve sonuç tablosu
    DataFreshness.tsx        Verinin kaç günlük olduğunu gösterir
    InlineScript.tsx         Ayrıştırma anında çalışan satır içi betik
    ModelAtlasMark.tsx       Ayrıntılı ürün işareti (arayüz yüzeyleri)
    ThemeToggle.tsx          Açık/koyu tema düğmesi
    JsonLd.tsx               Yapılandırılmış veriyi sayfaya gömer
    ui.tsx                   Badge, LicenseBadge, Stat
  data/
    types.ts                 Model ve Provider tipleri
    models.ts                ⭐ Tüm model verisi burada
    providers.ts             Sağlayıcı bilgileri
  lib/
    brand.ts                 Equinox ad ve adres sabitleri
    catalog.ts               Katalogdan türetilen görüntüleme kararları
    constants.ts             MAX_COMPARE, SITE_URL
    freshness.ts             Verinin yaşı ve tazelik eşiği
    format.ts                tr-TR sayı, fiyat ve tarih biçimlendirme
    jsonld.ts                schema.org üreticileri
    labels.ts                Yetenek/kip/lisans Türkçe etiketleri
    pricing.ts               Kademe çözümleme ve maliyet hesabı
    sort.ts                  Sıralama anahtarları ve karşılaştırıcı
    theme.ts                 Tema anahtarları ve ilk yükleme betiği
tools/brand/                 OG görseli ve Apple simgesinin üreteç kaynakları
scripts/build-brand-images.sh  Bu görselleri yeniden üretir
scripts/kaynak-kontrol.mjs   Kaynak sayfaları değişti mi, bildirir
kaynak-izi/                  Kaynak sayfalarının metin anlık görüntüleri
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

Görsel kimlik ağdan **kopyalanmadı**, ürün ailesi mantığıyla kuruldu.
Equinox'un kendi sayfası koyu ve atmosferiktir; Model Atlası ise fiyat sütunları
ve karşılaştırma tabloları olan veri yoğun bir sitedir. Aile bağı ortak ana
favicon'u çoğaltarak değil; ad kilidi, altın yörünge/düğüm ve ürünlere özgü
renkli işaret sistemiyle kurulur.

Equinox ağı bağının durduğu yerler:

- **Ürün işareti** — gül tonlu kutu içindeki karşılaştırma/veri sütunları,
  Equinox hub'ındaki Model Atlası kartından gelir. Ayrıntılı sürümde altın bir
  çizgi hem yükselen veri hattı hem de yörünge gibi okunur; düğümü Equinox
  ailesiyle bağı kurar. [ModelAtlasMark.tsx](src/components/ModelAtlasMark.tsx),
  `tools/brand/` altındaki OG ve Apple üreteçleri bu ayrıntılı sürümü taşır.
- **Favicon** — `app/icon.svg`, aynı sembolün 16–32 piksel için sadeleştirilmiş
  biçimidir. İnce yörünge ve parıltı bu ölçekte çamurlaşacağı için bilerek
  çıkarılmıştır. Favicon ile büyük logo aynı dosyanın küçültülmüş kopyası
  değildir.
- **Ad kilidi** — başlıkta "EQUINOX" üstte küçük ve altın, "Model Atlası" altta
  baskın. Tam ad `SITE_NAME` sabitindedir ve tüm başlık/OG etiketlerini besler.
- **Renkler** — Equinox altını ile Model Atlası'nın gül tonu yalnızca marka
  rayı, ürün işareti ve küçük ağ bağlarında buluşur; veri yüzeyleri
  sitenin kendi nötr paletini korur.

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

Bu depodaki veri şu kaynaklardan derlenmiştir:

| Sağlayıcı | Kaynak | Doğrulama |
| --- | --- | --- |
| Anthropic | `platform.claude.com/docs/en/about-claude/models/overview` | 2026-07-25 |
| OpenAI | `developers.openai.com/api/docs/pricing` | 2026-07-25 |
| Google | `ai.google.dev/gemini-api/docs/pricing` | 2026-07-25 |
| xAI | `docs.x.ai/docs/pricing` | 2026-07-25 |
| DeepSeek | `api-docs.deepseek.com/quick_start/pricing` | 2026-07-25 |
| Mistral | `docs.mistral.ai` model kartları (model başına ayrı) | 2026-07-25 |
| Alibaba | `alibabacloud.com/help/en/model-studio/model-pricing` | 2026-07-25 |
| Meta | `llama.com/docs/model-cards-and-prompt-formats/llama4/` | 2026-07-25 |
| Amazon | `docs.aws.amazon.com` Nova model kartları ve künye tablosu | 2026-07-26 |
| Microsoft | `huggingface.co/microsoft/*` Phi model kartları | 2026-07-26 |
| VNGRS (Kumru) | `medium.com/vngrs/kumru-llm-34d1628cfd93` | 2026-07-25 |

**Amazon fiyatları ayrı bir yerden geliyor.** Bedrock'ın fiyat sayfası
tarayıcıda JavaScript ile çizildiği için okunamıyor; fiyatlar AWS'nin makine
okunur resmî fiyat listesinden alındı:

```
https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/us-east-1/index.json
```

Bu dosya 1 milyon token değil **1.000 token** başına fiyat verir; katalogdaki
değerler bin ile çarpılarak yazılmıştır. Yalnızca standart isteğe bağlı
(on-demand) satırlar alınır — `batch`, `flex`, `priority`, `cross-region` ve
`custom-model` ekli kullanım türleri farklı fiyatlandırmadır ve katalogda
gösterilmez.

**Katalogdaki her modelin verisi sağlayıcının kendi resmî sayfasından
doğrulanmıştır.** Üçüncü parti toplayıcı kullanılmamaktadır; bu kural yeni model
eklerken de korunmalıdır. Sağlayıcının kendi sayfasında bulamadığınız bir modeli
toplayıcıdan alıp eklemeyin — bulunamıyor olması genellikle modelin emekliye
ayrıldığı anlamına gelir.

### Kaynak sayfalarını izlemek

```bash
npm run kaynak-kontrol              # kontrol et, rapor yaz
node scripts/kaynak-kontrol.mjs --guncelle   # anlık görüntüleri tazele
```

Betik on kaynak adresini çeker, metinlerini `kaynak-izi/metin/` altındaki anlık
görüntülerle karşılaştırır ve hangi sayfanın değiştiğini söyler. Anlık
görüntüler düz metin olarak depoda durduğu için `git diff kaynak-izi/metin/`
**neyin** değiştiğini de gösterir — bu, tekrar hangi fiyatı doğrulayacağınızı
bulmanın en hızlı yolu.

Betik fiyatı okuyup veriyle karşılaştırmaz ve bunu bilerek yapmaz: sayfa düzeni
değiştiğinde böyle bir ayrıştırıcı sessizce yanlış cevap verirdi. Kararı insan
verir; betik yalnızca nereye bakılacağını söyler.

**Otomatik okunamayan iki kaynak var** ve betik bunları "değişmedi" saymaz,
adıyla bildirir:

| Kaynak | Neden |
| --- | --- |
| `llama.com` model kartları | Sayfa JavaScript ile çiziliyor; düz `fetch` 40 karakterlik boş kabuk alıyor |
| `medium.com` (Kumru yazısı) | Medium otomatik istekleri 403 ile geri çeviriyor |

Bu ikisi her turda elle açılmalıdır. Yanlış güven, hiç bilgi olmamasından
kötüdür — bu yüzden okunamayan sayfa sessizce sağlam sayılmaz.

Doğrulama turu bittiğinde sıra: `models.ts` içindeki `verifiedAt` alanlarını
güncelleyin, sonra betiği `--guncelle` ile çalıştırıp anlık görüntüleri tazeleyin.

### Tazelik sitede görünür

Altbilgide ve Hakkında sayfasında verinin **en eski** doğrulama tarihi ve kaç
gün önce olduğu yazar; 45 günü aşınca "tazelenmeli" uyarısına döner. En yeni
değil en eski tarih gösterilir: tek bir modeli güncelleyip gerisini bırakmak
böylece taze görünmez.

Yaş tarayıcıda hesaplanır ([DataFreshness.tsx](src/components/DataFreshness.tsx)),
derleme anında değil. Statik dışa aktarımda sunucunun "bugün"ü derleme günüdür;
orada hesaplansaydı altı aylık veri ilelebet "1 gün önce doğrulandı" derdi —
yani tam olarak görünür kılmak istediğimiz şeyi gizlerdi.

Nitekim ilk doğrulama turunda Grok 4.1 Fast bu şekilde katalogdan çıkarıldı:
xAI'ın fiyat sayfasında ve model dokümantasyonunda yer almıyordu.

Bazı modellerin `maxOutput` değeri resmî sayfada belirtilmediği için boş
bırakılmıştır ve arayüzde "—" olarak görünür. Tahmin yazmak yerine boş bırakmak
tercih edilmiştir.

### Kademeli fiyatlandırma

Bazı sağlayıcılar istem uzunluğuna göre farklı fiyat uygular. Bu, `pricing`
içindeki **`tiers`** dizisiyle yapısal olarak ifade edilir:

```ts
pricing: {
  input: 0.03,                                   // ilk eşiğe kadar geçerli
  output: 0.13,
  tiers: [
    { over: 32_000, input: 0.1, output: 0.4 },   // 32 bin token'ı aşan istemler
    { over: 256_000, input: 0.2, output: 0.8 },
  ],
}
```

Kritik kural: **eşik aşıldığında isteğin tüm token'ları üst kademeden
ücretlendirilir.** Gelir vergisi gibi dilimlenmez. Bu katalogdaki üç sağlayıcı
da (xAI, Google, Alibaba) böyle çalışıyor; farklı davranan bir sağlayıcı
eklenirse `lib/pricing.ts` içindeki hesap da değişmelidir.

Süreli kampanyalar `promo` alanına yazılır:

```ts
promo: { input: 2, output: 10, until: "2026-08-31" },
```

Hesaplayıcı `until` tarihini **tarayıcıdaki güne** göre değerlendirir; site
statik olarak dışa aktarıldığı için derleme günü güvenilir değildir. Bitiş
tarihi açıklanmamış indirimler `promo` olarak yazılamaz — `note` alanında
düzyazı olarak kalır (Qwen3.7 Plus'taki %20 indirim böyle).

`note` artık yalnızca bu artık durumlar içindir; kademe ve kampanya bilgisini
oraya düzyazıyla yazmayın, hesaplayıcı okuyamaz.

Kademeli bir modelde taban fiyatın nereye kadar geçerli olduğu ana sayfa
istatistiğinde, model detay künyesinde ve karşılaştırma tablosunda açıkça
yazar ("32K token'a kadar"). Eski **bilinen sınırlama** — ana sayfanın
Qwen3.7 Flash'ı en ucuz göstermesi — böylece giderildi: rakam hâlâ en düşük
taban fiyat, ama artık geçerlilik aralığıyla birlikte gösteriliyor.

### Maliyet hesaplayıcı

`/hesaplayici` sayfası, girilen aylık kullanıma göre tüm modelleri ucuzdan
pahalıya sıralar. Hesap `lib/pricing.ts` içindeki saf fonksiyonlarda durur;
detay sayfası da kademe tablosunu aynı modülden üretir, iki ayrı hesap yoktur.

Bilinçli sınırlar:

- Yalnızca metin token'ı hesaplanır. Görsel ve ses girdisi, toplu işlem
  indirimi ve ücretsiz kota kapsam dışıdır.
- Önbellek fiyatı açıklamayan modellerde önbellek oranı **yok sayılır**;
  indirim uydurmaktansa tam fiyat göstermek doğru sonucu verir.
- Üst kademede önbellek fiyatı açıklanmamışsa taban önbellek fiyatı kullanılır
  ve bu, tablonun altında varsayım olarak belirtilir.
- Açık ağırlıklı modeller tabloya girmez, ayrı bir listede görünür: donanım
  maliyeti kullanıcıya bağlıdır ve token fiyatıyla karşılaştırılamaz.

### Lisans ile fiyat birbirinden bağımsızdır

"Açık ağırlıklı" bir modelin barındırılan API fiyatı olabilir. Mistral Large 3
ve Mistral Small 4 hem açık ağırlıklıdır hem de Mistral'ın kendi API'sinde
ücretlidir; Llama 4 modellerinde ise bir fiyat yazılmamıştır çünkü Meta
barındırma sunmaz. `license` alanını fiyatın varlığına bakarak doldurmayın.

## Ana sayfanın bilgi hiyerarşisi

2026-07-26'da ana sayfa baştan düzenlendi. Sorun estetik değil, hiyerarşiydi:
her şey aynı ağırlıkta olduğu için hiçbir şey öne çıkmıyordu. Ölçülen hâli:

| | Önce | Sonra |
|---|---|---|
| İlk model kartının konumu (masaüstü) | 1029 px | 550 px |
| İlk model kartının konumu (mobil) | 1507 px | 703 px |
| Sayfa yüksekliği (mobil) | 11.737 px | 5.142 px |
| Ana sayfadaki yuvarlak rozet | 211 | 0 |

Kararlar:

- **Liste varsayılan görünüm.** Kart ızgarası katalogun tamamını göz ile
  karşılaştırmaya elverişli değil: her sayı kendi kutusunda durduğu için
  sütun okuması yapılamıyor. Kart görünümü özet metni gösterdiği için keşif
  amacıyla seçenek olarak duruyor.
- **Rozetler veriden ayıklanıyor.** Bir yetenek modellerin yarısından
  fazlasında varsa gösterilmiyor; ayrıntısı [catalog.ts](src/lib/catalog.ts)
  içinde. Eşik sabit sayı değil, katalogdan hesaplanıyor.
- **Sağlayıcı rengi sol şeritte.** Daha önce 8 px'lik bir noktaydı ve sayfada
  hiç okunmuyordu; listeye ritim veren tek renk artık bu.
- **Filtre paneli katlanır**, ama etkin filtreler panel kapalıyken de
  kaldırılabilir çip olarak görünür. Kapalı bir panel kullanıcının neyi
  süzdüğünü unutmasına yol açmamalı.
- **Çıktı fiyatının altındaki çizgi logaritmik.** En ucuz çıktı 0,13 $, en
  pahalısı 180 $; doğrusal ölçekte modellerin neredeyse tamamı aynı görünürdü.

## Erişilebilirlik

2026-07-26'da altı sayfa türü ve iki tema tarayıcıda denetlendi: başlık sırası,
etiketsiz form denetimi, adsız bağlantı/düğme, tablo başlığı ve altyazısı,
`aria-expanded`/`aria-pressed` tutarlılığı, yer imleri, pozitif `tabindex` ve
metin kontrastı. Bulunan iki kusur giderildi:

- **Başlık düzeyi h1'den h3'e atlıyordu.** Model adları `h3`; araya `h2`
  girmediği için ekran okuyucunun belge taslağı bozuktu. Sonuç bölümüne
  `sr-only` bir `h2` eklendi.
- **`--text-faint` kontrastı 4,5:1 eşiğinin altındaydı** — açık temada 3,12,
  koyu temada 3,48. Bu belirteç 10-12 piksellik mikro etiketlerde kullanılıyor,
  yani WCAG'ın "büyük metin" istisnası geçerli değil. Açık tema `#6f6960`,
  koyu tema `#918980` yapıldı; her ikisi de üç zeminde (`bg`, `surface`,
  `surface-2`) AA geçiyor.

Renk belirteçlerini değiştirirken **ölçün**. En zorlu zemin `--surface-2`.
`--text-muted` sınırda değil (açık temada 5,32), ama açık renge doğru
kaydırmak onu da eşiğin altına indirir.

Denetim sırasında iki yanlış alarm çıktı, not düşüyorum ki tekrar aranmasın:
başlığın zemini `oklab()` biçiminde döndüğü için düz bir RGB ayrıştırıcısı onu
koyu sanıp sahte kontrast hatası üretiyor; ve tarayıcı penceresi odakta
değilken `document.activeElement` doğru öğeyi gösterse bile CSS `:focus`
eşleşmiyor, dolayısıyla atlama bağlantısı görünmez sanılabiliyor. İkincisi için
doğru denetim, derlenmiş CSS'te `focus\:not-sr-only:focus` kuralının
`.sr-only`'den sonra geldiğini doğrulamak.

Üçüncü bir tuzak kaydırmayla ilgili: önizleme panelinde `window.scrollTo()`
sayfayı kaydırır ama **`scroll` olayı yaymaz**, `behavior: "smooth"` ise hiç
kaydırmaz. Kaydırmaya bağlı davranışı (örneğin başa dön düğmesini) orada
sınarsanız çalışmıyor sanırsınız. Doğru denetim gerçek fare tekerleğiyle
kaydırmak veya sayfayı gerçek bir tarayıcıda açmak.

## Ziyaretçi ölçümü

Çerezsiz ve kimliksiz bir sayaç kullanılır (Cloudflare Web Analytics).
[Analytics.tsx](src/components/Analytics.tsx) yalnızca
`NEXT_PUBLIC_CF_ANALYTICS_TOKEN` tanımlıysa betiği çizer; tanımlı değilse
hiçbir şey eklenmez. Yerel geliştirmede ve depoyu çatallayanlarda sayaç
kendiliğinden kapalıdır.

Belirteç depoya yazılmaz, GitHub deposunda **repository variable** olarak
`CF_ANALYTICS_TOKEN` adıyla durur ve derleme adımında okunur. Gizli bir bilgi
değildir (sayfa kaynağında görünür), ama çatalların bizim ölçümümüze veri
göndermemesi için değişkende tutulur.

Cloudflare tarafında `ai.sametbasbug.dev` **manuel (JS snippet) kurulum** olarak
tanımlıdır — otomatik kurulum yalnızca trafiği Cloudflare üzerinden geçen
alanlarda çalışır, bu alan ise GitHub Pages'ten sunuluyor. Belirteci Cloudflare
panelinde Web Analytics → ilgili site → *Manage site* altında bulursunuz.

Betiğe `type="module"` eklemeyin: Cloudflare panelde snippet'i öyle veriyor ama
`beacon.min.js` düz bir IIFE, modül sözdizimi içermiyor. `defer` doğru biçim,
`type="module"` ayrıca lint'in `no-sync-scripts` kuralına takılır.

## Bilinçli tasarım kararları

- **Karşılaştırma seçimi URL'de tutulur** (`/karsilastir?m=a&m=b`). Böylece bir
  karşılaştırma bağlantısı olduğu gibi paylaşılabilir.
- **Liste satırı dar ekranda ızgara değil, düşey yığın.** CSS ızgarası satırı
  açıkça belirtilmiş öğeleri (`row-start-1`) otomatik yerleşenlerden önce
  yerleştirir; ızgarayı dar ekranda kullanınca seçim düğmesi ilk sütunu kapıp
  model adını sağa itiyordu.
- **Dar ekranda başlık iki satır.** 375 px'te menü tek başına 300 px, marka
  yazısı 85 px istiyor; tek satırda 88 px taşıyordu. Marka yazısı önceden
  `min-[420px]` eşiğine bağlıydı ve yaygın telefonların hepsi (390, 393, 402)
  o eşiğin altında olduğu için ad fiilen hiçbir telefonda görünmüyordu.
  Alternatif hamburger menüydü; dört bağlantı için bir tıklama maliyeti ve
  JS'e bağımlı bir menü, ikinci satırın 31 pikseline değmedi.
- **Liste varsayılan olarak ilk 20 modeli gösterir**, gerisi düğmeyle açılır.
  Katalog büyüdükçe altbilgideki düzeltme kanalı ve veri tazeliği fiilen
  ulaşılamaz hâle geliyordu: 38 modelde altbilgi mobilde 5.337 px'teydi.
  Kırpma yalnızca hidrasyondan sonra uygulanır — sunucu çıktısı tam listeyi
  içerir, yani arama motorları ve JavaScript çalışmayan okuyucu her modeli
  görür. Kırpma görünür alanın çok altında olduğu için sıçrama fark edilmez.
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
- **Tema seçimi `<html data-theme>` özniteliğinde, betik `<body>`nin ilk
  çocuğunda.** Site statik HTML olarak sunulur; sunucu ziyaretçinin daha önce
  hangi temayı seçtiğini bilemez. Seçimi uygulayan betik `<body>`nin en başında
  ve eş zamanlı çalışır — ayrıştırma orada durur, öznitelik yerleşir, sonra
  içerik çizilir. Betik daha sonraya bırakılsaydı koyu tema seçmiş kullanıcı her
  sayfa açılışında önce açık temayı görürdü. `next/script` burada uygun değil:
  `beforeInteractive` bile ilk boyamadan önce çalışmayı garanti etmez.
- **`<html>` üzerinde `suppressHydrationWarning` var ve zorunludur.** Betik
  `data-theme` özniteliğini React hidrasyondan önce yazdığı için sunucu çıktısı
  ile istemci DOM'u burada bilerek ayrışır; bastırma olmadan her sayfa
  yüklemesinde hidrasyon uyuşmazlığı hatası alınır. Bastırma yalnızca o öğenin
  kendi özniteliklerini kapsar, alt ağacı değil.
- **Tema durumu `useState` ile değil `useSyncExternalStore` ile okunur.** Etkin
  tema tarayıcıya ait bir durumdur (öznitelik + sistem tercihi), React durumu
  değil. `useEffect` içinde `setState` çağırmak hem lint kuralını ihlal eder
  hem de gereksiz bir çizim turu ekler; `getServerSnapshot`'ın `null` dönmesi
  sunucuda etkin temanın bilinemeyeceğini doğrudan ifade eder.
- **Koyu tema belirteçleri CSS'te iki kez yazılıdır.** Biri medya sorgusunun
  içinde (sistem koyu, kullanıcı açık seçmemiş), diğeri dışında (kullanıcı koyu
  seçmiş). Düz CSS'te bir bildirim bloğunu iki bağlamda yeniden kullanmanın yolu
  yok. **Bir rengi değiştirirken iki bloğu da güncelleyin.**
- **Yapılandırılmış veride `Product` + `offers` kullanılmadı.** Fiyatlarımız
  "1 milyon token başına" birim fiyatlardır; `offers.price` ise satın alınabilir
  bir ürünün bedelini ifade eder. İkisini eşitlemek arama motoruna 2 dolarlık
  bir ürün varmış gibi yanlış bilgi vermek olurdu. Bunun yerine model
  sayfalarında `SoftwareApplication` + `BreadcrumbList`, ana sayfada `WebSite` +
  `Organization` işaretlenir — hepsi doğruluğundan emin olduğumuz iddialar.
  Fiyat bilgisi sayfada zaten metin olarak duruyor.
- **Karşılaştırma sayfasının kanonik adresi parametresizdir.** Seçim `?m=`
  parametrelerinde tutulduğu için her kombinasyon ayrı bir adres üretir; kanonik
  adres olmasa arama motoru bunları sayısız kopya sayfa olarak görürdü.
- **JSON-LD gömülürken `<` kaçırılır.** Veri içinde `</script>` geçen bir metin
  olsaydı tarayıcı betiği orada kapatır ve kalan JSON sayfaya HTML olarak
  sızardı. Veri şu an elle yazılıyor ve böyle bir dize içermiyor, ama
  [JsonLd.tsx](src/components/JsonLd.tsx) bileşeninin güvenliği içeriğe bağlı
  olmamalı.
- **Satır içi tema betiği `InlineScript` ile sarmalanır.** React, istemcide
  çizim sırasında çalıştırılabilir bir `<script>` görünce geliştirme kipinde
  uyarı veriyor. Uyarı doğru — betik istemcide çalışmaz — ama bizim istediğimiz
  zaten bu, dolayısıyla konsolda kalıcı gürültü olmasının anlamı yok.
  [InlineScript.tsx](src/components/InlineScript.tsx) betiğin türünü sunucuda
  `text/javascript`, istemcide `text/plain` yapar; React yalnızca
  çalıştırılabilir türleri uyarıyor. Çözüm Next'in
  `preventing-flash-before-hydration` rehberinden. `application/ld+json` de
  muaf olduğu için `JsonLd` bu sarmalayıcıya ihtiyaç duymaz.
- **Marka adı CSS ile büyütülmez.** Belge `lang="tr"` olduğu için tarayıcı
  `text-transform: uppercase` uygularken Türkçe kuralını izler ve `i` harfini
  noktalı `İ` yapar: "Equinox" → "EQUİNOX". Türkçe sözcükler için doğru olan bu
  davranış marka adı için yanlış olduğundan büyük harfli biçim `brand.ts`
  içinde harfi harfine yazılıdır. Sayfa içindeki Türkçe üst başlıklar
  (`TÜRKÇE YAPAY ZEKÂ MODEL REHBERİ`) CSS ile büyütülmeye devam eder — orada
  noktalı `İ` istenen sonuçtur.

## Yapılmayanlar

İlk sürümde bilinçli olarak kapsam dışı bırakılanlar:

- Canlı fiyat çekme veya CMS entegrasyonu
- Kıyaslama (benchmark) skorları
