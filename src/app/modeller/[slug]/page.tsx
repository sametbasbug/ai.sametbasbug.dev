import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, LicenseBadge, Stat } from "@/components/ui";
import { getModel, models } from "@/data/models";
import { providerMap } from "@/data/providers";
import {
  formatContext,
  formatDate,
  formatParameters,
  formatPrice,
  formatTokens,
} from "@/lib/format";
import {
  capabilityDescriptions,
  capabilityLabels,
  modalityLabels,
} from "@/lib/labels";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return models.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return { title: "Model bulunamadı" };

  const provider = providerMap[model.providerId];
  return {
    title: `${model.name} (${provider.name})`,
    description: `${model.summary} Bağlam penceresi ${formatContext(
      model.contextWindow,
    )}. Fiyat, yetenekler ve karşılaştırma.`,
  };
}

export default async function ModelPage({ params }: Params) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();

  const provider = providerMap[model.providerId];

  // Aynı sağlayıcıdan değilse bile bağlam/fiyat olarak yakın modeller.
  const alternatives = models
    .filter((m) => m.slug !== model.slug && m.providerId !== model.providerId)
    .map((m) => ({
      model: m,
      distance:
        Math.abs(Math.log10(m.contextWindow) - Math.log10(model.contextWindow)) +
        Math.abs(
          Math.log10((m.pricing?.output ?? 0.01) + 0.01) -
            Math.log10((model.pricing?.output ?? 0.01) + 0.01),
        ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((entry) => entry.model);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Geri" className="mb-8">
        <Link
          href="/"
          className="text-sm text-text-muted underline-offset-4 hover:text-text hover:underline"
        >
          ← Tüm modeller
        </Link>
      </nav>

      <header>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: provider.accent }}
          />
          <Link
            href={`/saglayicilar#${provider.id}`}
            className="text-sm font-medium text-text-muted underline-offset-4 hover:text-text hover:underline"
          >
            {provider.name}
          </Link>
          <span className="text-text-faint">·</span>
          <span className="text-sm text-text-muted">{provider.country}</span>
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {model.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">
          {model.summary}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <LicenseBadge license={model.license} />
          <code className="rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-xs text-text-muted">
            {model.apiId}
          </code>
          <Link
            href={`/karsilastir/?m=${model.slug}`}
            className="ml-auto rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            Karşılaştırmaya ekle
          </Link>
        </div>
      </header>

      {/* --------------------------------------------------- teknik künye */}
      <section className="mt-10 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-faint">
          Teknik künye
        </h2>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          <Stat
            label="Bağlam penceresi"
            value={formatContext(model.contextWindow)}
            hint={formatTokens(model.contextWindow)}
          />
          <Stat
            label="Azami çıktı"
            value={model.maxOutput ? formatContext(model.maxOutput) : "—"}
            hint={model.maxOutput ? "token" : "Belirtilmemiş"}
          />
          <Stat
            label="Girdi fiyatı"
            value={model.pricing ? formatPrice(model.pricing.input) : "—"}
            hint={model.pricing ? "1M token" : "Kendi barındırmanız"}
          />
          <Stat
            label="Çıktı fiyatı"
            value={model.pricing ? formatPrice(model.pricing.output) : "—"}
            hint={model.pricing ? "1M token" : "Kendi barındırmanız"}
          />
          {model.pricing?.cachedInput !== undefined ? (
            <Stat
              label="Önbellekli girdi"
              value={formatPrice(model.pricing.cachedInput)}
              hint="1M token"
            />
          ) : null}
          {model.parameters ? (
            <Stat
              label="Parametre"
              value={formatParameters(model.parameters)}
              hint="açıklanan"
            />
          ) : null}
          <Stat
            label="Girdi kipleri"
            value={model.inputModalities
              .map((m) => modalityLabels[m])
              .join(", ")}
          />
          <Stat
            label="Çıktı kipleri"
            value={model.outputModalities
              .map((m) => modalityLabels[m])
              .join(", ")}
          />
        </dl>

        {model.pricing?.note ? (
          <p className="mt-5 rounded-lg border border-accent/20 bg-accent-soft px-3 py-2 text-sm text-accent">
            {model.pricing.note}
          </p>
        ) : null}

        {model.pricing === null ? (
          <p className="mt-5 rounded-lg border border-open/20 bg-open-soft px-3 py-2 text-sm text-open">
            Bu model açık ağırlıklıdır: token başına ücret ödemezsiniz, buna
            karşılık donanım ve işletme maliyetini siz üstlenirsiniz.
          </p>
        ) : null}
      </section>

      {/* -------------------------------------------------------- açıklama */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Model hakkında</h2>
        <p className="mt-4 leading-[1.75] text-text-muted">
          {model.description}
        </p>
      </section>

      {/* ------------------------------------------------- güçlü / zayıf */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold">Güçlü yönleri</h2>
          <ul className="mt-4 space-y-3">
            {model.strengths.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                <span aria-hidden className="mt-0.5 shrink-0 text-open">
                  ✓
                </span>
                <span className="text-text-muted">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold">Dikkat edilmesi gerekenler</h2>
          <ul className="mt-4 space-y-3">
            {model.weaknesses.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                <span aria-hidden className="mt-0.5 shrink-0 text-accent">
                  !
                </span>
                <span className="text-text-muted">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ------------------------------------------------ kullanım / yetenek */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Tipik kullanım senaryoları
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {model.useCases.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Yetenekler</h2>
        <dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface">
          {model.capabilities.map((cap) => (
            <div key={cap} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:gap-6">
              <dt className="w-40 shrink-0 text-sm font-medium">
                {capabilityLabels[cap]}
              </dt>
              <dd className="text-sm leading-relaxed text-text-muted">
                {capabilityDescriptions[cap]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------------ alternatifler */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Benzer alternatifler
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Bağlam penceresi ve fiyat açısından en yakın diğer sağlayıcı modelleri.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {alternatives.map((alt) => (
            <li key={alt.slug}>
              <Link
                href={`/modeller/${alt.slug}`}
                className="block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
              >
                <span className="text-xs text-text-faint">
                  {providerMap[alt.providerId].name}
                </span>
                <span className="mt-0.5 block text-sm font-medium">
                  {alt.name}
                </span>
                <span className="mt-2 block text-xs text-text-muted tabular-nums">
                  {formatContext(alt.contextWindow)} ·{" "}
                  {alt.pricing ? formatPrice(alt.pricing.output) : "açık"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Link
            href={`/karsilastir/?m=${model.slug}&m=${alternatives
              .map((a) => a.slug)
              .join("&m=")}`}
            className="inline-block rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-border-strong"
          >
            Bu dördünü karşılaştır
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------ kaynak */}
      <section className="mt-12 border-t border-border pt-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
          <Badge>Kaynak</Badge>
          <a
            href={model.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-text"
          >
            {new URL(model.source.url).hostname}
          </a>
          <span className="text-text-faint">
            {formatDate(model.source.verifiedAt)} tarihinde doğrulandı
          </span>
          <a
            href={model.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto underline underline-offset-4 hover:text-text"
          >
            Resmî dokümantasyon ↗
          </a>
        </div>
      </section>
    </article>
  );
}
