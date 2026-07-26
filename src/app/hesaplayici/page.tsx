import type { Metadata } from "next";
import { CostCalculator } from "@/components/CostCalculator";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Maliyet hesaplayıcı",
  description:
    "Aylık token kullanımınızı girin, yapay zekâ modellerinin size kaça mal olacağını ucuzdan pahalıya görün. Uzun bağlam kademeleri ve önbellek indirimleri hesaba katılır.",
  alternates: { canonical: "/hesaplayici/" },
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Modeller", path: "/" },
          { name: "Maliyet hesaplayıcı", path: "/hesaplayici/" },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Maliyet hesaplayıcı
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-text-muted">
          Kullanımınızı girin, katalogdaki her modelin aylık token maliyetini
          ucuzdan pahalıya sıralayalım. Liste fiyatını karşılaştırmak yanıltıcı
          olabilir: uzun istemlerde bazı modellerde fiyat ikiye katlanır,
          önbellek kullanan uygulamalarda ise girdi maliyeti onda birine iner.
          Hesap bunların ikisini de dikkate alır.
        </p>
      </header>

      <CostCalculator />
    </div>
  );
}
