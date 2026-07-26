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
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pb-16 sm:pt-24">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Türkçe yapay zekâ model rehberi
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Hangi yapay zekâ modeli işinize uygun?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
            Claude, GPT, Gemini, Grok, Llama, Qwen ve yerli Kumru dahil{" "}
            {models.length} modeli tek yerde inceleyin. Bağlam penceresi, fiyat
            ve yeteneklerine göre filtreleyin, dördüne kadar modeli yan yana
            karşılaştırın.
          </p>

          <div className="mt-6">
            <Link
              href="/hesaplayici"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-border-strong"
            >
              Kendi kullanımınıza göre maliyet hesaplayın
              <span aria-hidden>→</span>
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
            {highlights.map((item) => (
              <div key={item.label} className="border-l-2 border-border pl-3">
                <dt className="text-xs uppercase tracking-wide text-text-faint">
                  {item.label}
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {item.value}
                </dd>
                {item.hint ? (
                  <p className="mt-0.5 truncate text-xs text-text-faint">
                    {item.hint}
                  </p>
                ) : null}
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ModelExplorer />
      </div>
    </>
  );
}
