"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { models } from "@/data/models";
import { providers } from "@/data/providers";
import type { Capability, License, ProviderId } from "@/data/types";
import { capabilityLabels } from "@/lib/labels";
import { MAX_COMPARE } from "@/lib/constants";
import { ModelCard } from "./ModelCard";

type SortKey = "varsayilan" | "ucuz" | "pahali" | "baglam" | "isim";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "varsayilan", label: "Sağlayıcıya göre" },
  { value: "ucuz", label: "En ucuz (çıktı)" },
  { value: "pahali", label: "En pahalı (çıktı)" },
  { value: "baglam", label: "En geniş bağlam" },
  { value: "isim", label: "İsme göre (A-Z)" },
];

const contextOptions: { value: number; label: string }[] = [
  { value: 0, label: "Tümü" },
  { value: 128_000, label: "128K ve üzeri" },
  { value: 1_000_000, label: "1M ve üzeri" },
  { value: 2_000_000, label: "2M ve üzeri" },
];

const licenseOptions: { value: License | "tumu"; label: string }[] = [
  { value: "tumu", label: "Tümü" },
  { value: "kapali", label: "Kapalı kaynak" },
  { value: "acik-agirlik", label: "Açık ağırlıklı" },
];

const allCapabilities = Object.keys(capabilityLabels) as Capability[];

const providerOrder = new Map(providers.map((p, i) => [p.id, i]));

export function ModelExplorer() {
  const [query, setQuery] = useState("");
  const [activeProviders, setActiveProviders] = useState<Set<ProviderId>>(
    new Set(),
  );
  const [activeCapabilities, setActiveCapabilities] = useState<Set<Capability>>(
    new Set(),
  );
  const [license, setLicense] = useState<License | "tumu">("tumu");
  const [minContext, setMinContext] = useState(0);
  const [sort, setSort] = useState<SortKey>("varsayilan");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleFrom = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    return next;
  };

  const toggleSelected = (slug: string) => {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : current.length < MAX_COMPARE
          ? [...current, slug]
          : current,
    );
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");

    const filtered = models.filter((model) => {
      if (activeProviders.size > 0 && !activeProviders.has(model.providerId)) {
        return false;
      }
      if (license !== "tumu" && model.license !== license) return false;
      if (model.contextWindow < minContext) return false;
      if (
        activeCapabilities.size > 0 &&
        ![...activeCapabilities].every((cap) =>
          model.capabilities.includes(cap),
        )
      ) {
        return false;
      }
      if (needle) {
        const haystack = [
          model.name,
          model.apiId,
          model.summary,
          model.providerId,
        ]
          .join(" ")
          .toLocaleLowerCase("tr-TR");
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    // Açık ağırlıklı modellerin fiyatı yok; fiyat sıralamalarında sona alınır.
    const outputPrice = (p: number | undefined) =>
      p ?? Number.POSITIVE_INFINITY;

    return filtered.sort((a, b) => {
      switch (sort) {
        case "ucuz":
          return (
            outputPrice(a.pricing?.output) - outputPrice(b.pricing?.output)
          );
        case "pahali":
          return (
            (b.pricing?.output ?? -1) - (a.pricing?.output ?? -1)
          );
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
  }, [query, activeProviders, activeCapabilities, license, minContext, sort]);

  const hasFilters =
    query !== "" ||
    activeProviders.size > 0 ||
    activeCapabilities.size > 0 ||
    license !== "tumu" ||
    minContext !== 0;

  const resetFilters = () => {
    setQuery("");
    setActiveProviders(new Set());
    setActiveCapabilities(new Set());
    setLicense("tumu");
    setMinContext(0);
  };

  const compareHref = `/karsilastir/?m=${selected.join("&m=")}`;

  return (
    <div className="pb-28">
      {/* ------------------------------------------------------- filtreler */}
      <section
        aria-label="Filtreler"
        className="rounded-xl border border-border bg-surface p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="arama" className="sr-only">
              Model ara
            </label>
            <input
              id="arama"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Model veya sağlayıcı ara — örn. Claude, Gemini, Kumru"
              className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm placeholder:text-text-faint focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex gap-3">
            <div>
              <label htmlFor="siralama" className="sr-only">
                Sıralama
              </label>
              <select
                id="siralama"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="baglam" className="sr-only">
                En az bağlam penceresi
              </label>
              <select
                id="baglam"
                value={minContext}
                onChange={(e) => setMinContext(Number(e.target.value))}
                className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
              >
                {contextOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Bağlam: {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <FilterRow label="Sağlayıcı">
            {providers.map((provider) => {
              const active = activeProviders.has(provider.id);
              return (
                <Chip
                  key={provider.id}
                  active={active}
                  onClick={() =>
                    setActiveProviders((s) => toggleFrom(s, provider.id))
                  }
                >
                  <span
                    aria-hidden
                    className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                    style={{ backgroundColor: provider.accent }}
                  />
                  {provider.name}
                </Chip>
              );
            })}
          </FilterRow>

          <FilterRow label="Yetenek">
            {allCapabilities.map((cap) => (
              <Chip
                key={cap}
                active={activeCapabilities.has(cap)}
                onClick={() =>
                  setActiveCapabilities((s) => toggleFrom(s, cap))
                }
              >
                {capabilityLabels[cap]}
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label="Lisans">
            {licenseOptions.map((option) => (
              <Chip
                key={option.value}
                active={license === option.value}
                onClick={() => setLicense(option.value)}
              >
                {option.label}
              </Chip>
            ))}
          </FilterRow>
        </div>
      </section>

      {/* ---------------------------------------------------------- sonuç */}
      <div className="mt-6 flex items-baseline justify-between">
        <p className="text-sm text-text-muted" aria-live="polite">
          <strong className="font-semibold text-text">{visible.length}</strong>{" "}
          model listeleniyor
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm text-accent underline-offset-4 hover:underline"
          >
            Filtreleri temizle
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border-strong p-12 text-center">
          <p className="font-medium">Bu filtrelerle eşleşen model yok.</p>
          <p className="mt-1 text-sm text-text-muted">
            Bir yetenek veya sağlayıcı seçimini kaldırmayı deneyin.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((model) => (
            <ModelCard
              key={model.slug}
              model={model}
              selected={selected.includes(model.slug)}
              disabled={
                !selected.includes(model.slug) && selected.length >= MAX_COMPARE
              }
              onToggle={toggleSelected}
            />
          ))}
        </div>
      )}

      {/* --------------------------------------------- karşılaştırma çubuğu */}
      {selected.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <p className="text-sm text-text-muted">
              <strong className="font-semibold text-text">
                {selected.length}
              </strong>{" "}
              / {MAX_COMPARE} model seçildi
            </p>

            <ul className="flex flex-wrap gap-1.5">
              {selected.map((slug) => {
                const model = models.find((m) => m.slug === slug);
                if (!model) return null;
                return (
                  <li key={slug}>
                    <button
                      type="button"
                      onClick={() => toggleSelected(slug)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-2.5 py-1 text-xs hover:border-border-strong"
                    >
                      {model.name}
                      <span aria-hidden className="text-text-faint">
                        ×
                      </span>
                      <span className="sr-only">seçimden çıkar</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelected([])}
                className="rounded-lg px-3 py-2 text-sm text-text-muted hover:text-text"
              >
                Temizle
              </button>
              <Link
                href={compareHref}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent-hover"
              >
                Karşılaştır
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">{label}</legend>
      <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wide text-text-faint">
        {label}
      </span>
      {children}
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-bg text-text-muted hover:border-border-strong hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
