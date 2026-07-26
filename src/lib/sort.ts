import { providers } from "@/data/providers";
import type { Model } from "@/data/types";

export type SortKey =
  | "varsayilan"
  | "isim"
  | "baglam"
  | "girdi-ucuz"
  | "girdi-pahali"
  | "cikti-ucuz"
  | "cikti-pahali";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "varsayilan", label: "Sağlayıcıya göre" },
  { value: "cikti-ucuz", label: "En ucuz (çıktı)" },
  { value: "cikti-pahali", label: "En pahalı (çıktı)" },
  { value: "girdi-ucuz", label: "En ucuz (girdi)" },
  { value: "baglam", label: "En geniş bağlam" },
  { value: "isim", label: "İsme göre (A-Z)" },
];

const providerOrder = new Map(providers.map((provider, i) => [provider.id, i]));

/**
 * Açık ağırlıklı modellerin fiyatı yok. Ucuzdan pahalıya sıralamada sona,
 * pahalıdan ucuza sıralamada yine sona giderler: "fiyatı yok" ile "bedava"
 * aynı şey değil, listenin başında görünmeleri yanlış okuma üretir.
 */
const asc = (price: number | undefined) => price ?? Number.POSITIVE_INFINITY;
const desc = (price: number | undefined) => price ?? Number.NEGATIVE_INFINITY;

export function sortModels(list: Model[], key: SortKey): Model[] {
  return [...list].sort((a, b) => {
    switch (key) {
      case "cikti-ucuz":
        return asc(a.pricing?.output) - asc(b.pricing?.output);
      case "cikti-pahali":
        return desc(b.pricing?.output) - desc(a.pricing?.output);
      case "girdi-ucuz":
        return asc(a.pricing?.input) - asc(b.pricing?.input);
      case "girdi-pahali":
        return desc(b.pricing?.input) - desc(a.pricing?.input);
      case "baglam":
        return b.contextWindow - a.contextWindow;
      case "isim":
        return a.name.localeCompare(b.name, "tr-TR");
      default: {
        const providerDiff =
          (providerOrder.get(a.providerId) ?? 99) -
          (providerOrder.get(b.providerId) ?? 99);
        return providerDiff !== 0
          ? providerDiff
          : b.contextWindow - a.contextWindow;
      }
    }
  });
}
