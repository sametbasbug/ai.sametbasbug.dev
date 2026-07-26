import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ModelExplorer } from "@/components/ModelExplorer";
import { models } from "@/data/models";
import { providers } from "@/data/providers";
import { formatContext, formatPrice } from "@/lib/format";
import { websiteJsonLd } from "@/lib/jsonld";
import { baseValidUpTo } from "@/lib/pricing";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const priced = models.filter((m) => m.pricing !== null);
  const cheapest = priced.reduce((min, m) =>
    m.pricing!.output < min.pricing!.output ? m : min,
  );
  const widest = models.reduce((max, m) =>
    m.contextWindow > max.contextWindow ? m : max,
  );
  const openWeight = models.filter((m) => m.license === "acik-agirlik").length;
  const cheapestLimit = baseValidUpTo(cheapest.pricing!);

  const highlights = [
    { label: "Model", value: String(models.length) },
    { label: "Sağlayıcı", value: String(providers.length) },
    { label: "Açık ağırlıklı", value: String(openWeight) },
    {
      label: "En geniş bağlam",
      value: formatContext(widest.contextWindow),
      hint: widest.name,
    },
    {
      label: "En düşük çıktı fiyatı",
      value: formatPrice(cheapest.pricing!.output),
      // Kademeli bir modelde taban fiyat yalnızca ilk eşiğe kadar geçerli.
      // Sınırı yazmazsak bu rakam modelin tamamı için geçerli sanılır ve kart
      // en ucuz modeli yanlış gösterir.
      hint: cheapestLimit
        ? `${cheapest.name} · ${formatContext(cheapestLimit)} token'a kadar`
        : cheapest.name,
    },
  ];

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="grid-backdrop absolute inset-0 opacity-60" />
        {/*
          Giriş bölümü bilerek kısa tutuluyor. Önceki hâlinde ilk model kartı
          masaüstünde 1029, mobilde 1507 piksel aşağıdaydı — katalog sitesinde
          ilk ekranda ürün görünmesi gerekir. Başlık, tek cümlelik tanım ve
          rakam şeridi kalıyor; hepsi bir ekrana sığacak ölçüde.
        */}
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            Türkçe yapay zekâ model rehberi
          </p>
          <h1 className="mt-3 max-w-3xl text-[1.75rem] font-semibold leading-[1.12] tracking-tight sm:text-[2.5rem]">
            Hangi yapay zekâ modeli işinize uygun?
          </h1>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl leading-relaxed text-text-muted">
              {models.length} modeli fiyat, bağlam penceresi ve yeteneklerine
              göre karşılaştırın.
            </p>
            <Link
              href="/hesaplayici"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-border-strong sm:self-auto"
            >
              Maliyet hesaplayıcı
              <span aria-hidden>→</span>
            </Link>
          </div>

          <dl className="mt-7 grid grid-cols-3 gap-x-4 gap-y-4 sm:grid-cols-5 sm:gap-x-6">
            {highlights.map((item) => (
              <div key={item.label} className="border-l-2 border-border pl-3">
                <dt className="text-[10px] uppercase tracking-wide text-text-faint">
                  {item.label}
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums sm:text-xl">
                  {item.value}
                </dd>
                {item.hint ? (
                  // `truncate` değil `line-clamp-2`: en düşük fiyat kartının
                  // ipucu artık geçerlilik aralığını da taşıyor ve dar ekranda
                  // tek satıra sığmıyor — kesilirse söylediği şey kayboluyor.
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-text-faint">
                    {item.hint}
                  </p>
                ) : null}
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <ModelExplorer />
      </div>
    </>
  );
}
