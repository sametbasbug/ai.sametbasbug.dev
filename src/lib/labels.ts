import type { Capability, License, Modality } from "@/data/types";

export const capabilityLabels: Record<Capability, string> = {
  "akil-yurutme": "Akıl yürütme",
  "gorsel-anlama": "Görsel anlama",
  "arac-kullanimi": "Araç kullanımı",
  kod: "Kod yazımı",
  "uzun-baglam": "Uzun bağlam",
  onbellekleme: "Önbellekleme",
  "toplu-islem": "Toplu işlem",
  "ince-ayar": "İnce ayar",
  "yerel-calisma": "Yerel çalışma",
};

export const capabilityDescriptions: Record<Capability, string> = {
  "akil-yurutme":
    "Yanıt vermeden önce adım adım düşünerek karmaşık problemleri çözebilir.",
  "gorsel-anlama": "Görsel, ekran görüntüsü ve grafikleri girdi olarak alabilir.",
  "arac-kullanimi":
    "Harici fonksiyon ve API'leri kendisi çağırabilir (function calling).",
  kod: "Kod üretme, hata ayıklama ve inceleme için özel olarak eğitilmiştir.",
  "uzun-baglam": "500 bin token ve üzeri bağlam penceresi sunar.",
  onbellekleme:
    "Tekrar eden istem ön ekleri indirimli ücretlendirilir (prompt caching).",
  "toplu-islem":
    "Gecikmeye duyarlı olmayan işler için indirimli toplu API desteği vardır.",
  "ince-ayar": "Kendi verinizle özelleştirilebilir (fine-tuning).",
  "yerel-calisma": "Kendi donanımınızda çevrimdışı çalıştırılabilir.",
};

export const modalityLabels: Record<Modality, string> = {
  metin: "Metin",
  gorsel: "Görsel",
  ses: "Ses",
  video: "Video",
};

export const licenseLabels: Record<License, string> = {
  kapali: "Kapalı kaynak",
  "acik-agirlik": "Açık ağırlıklı",
};
