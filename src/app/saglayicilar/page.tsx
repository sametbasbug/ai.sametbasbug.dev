import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { models } from "@/data/models";
import { providers } from "@/data/providers";
import { formatContext, formatPrice } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Sağlayıcılar",
  description:
    "Anthropic, OpenAI, Google, xAI, DeepSeek, Meta, Mistral, Alibaba ve VNGRS — yapay zekâ model sağlayıcılarının Türkçe karşılaştırmalı özeti.",
  alternates: { canonical: "/saglayicilar/" },
};

export default function ProvidersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Modeller", path: "/" },
          { name: "Sağlayıcılar", path: "/saglayicilar/" },
        ])}
      />

      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Sağlayıcılar
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-text-muted">
          Model seçerken yalnızca fiyat ve performans değil, verinin nerede
          işlendiği de önemlidir. Aşağıda her sağlayıcının konumu ve katalogdaki
          modelleri listelenmiştir.
        </p>
      </header>

      <div className="space-y-8">
        {providers.map((provider) => {
          const own = models
            .filter((m) => m.providerId === provider.id)
            .sort((a, b) => b.contextWindow - a.contextWindow);

          return (
            <section
              key={provider.id}
              id={provider.id}
              className="scroll-mt-20 rounded-xl border border-border bg-surface p-6"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span
                  aria-hidden
                  className="h-3 w-3 shrink-0 self-center rounded-full"
                  style={{ backgroundColor: provider.accent }}
                />
                <h2 className="text-xl font-semibold tracking-tight">
                  {provider.name}
                </h2>
                <span className="text-sm text-text-muted">
                  {provider.country}
                </span>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-sm text-text-muted underline underline-offset-4 hover:text-text"
                >
                  Web sitesi ↗
                </a>
              </div>

              <p className="mt-3 leading-relaxed text-text-muted">
                {provider.blurb}
              </p>

              <ul className="mt-5 divide-y divide-border border-t border-border">
                {own.map((model) => (
                  <li key={model.slug}>
                    <Link
                      href={`/modeller/${model.slug}`}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 transition-colors hover:text-accent"
                    >
                      <span className="text-sm font-medium">{model.name}</span>
                      <span className="text-xs text-text-faint tabular-nums">
                        {formatContext(model.contextWindow)} bağlam
                      </span>
                      <span className="ml-auto text-xs text-text-muted tabular-nums">
                        {model.pricing
                          ? `${formatPrice(model.pricing.input)} / ${formatPrice(
                              model.pricing.output,
                            )}`
                          : "Açık ağırlıklı"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
