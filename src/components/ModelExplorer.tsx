"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { models } from "@/data/models";
import { providers } from "@/data/providers";
import type { Capability, License, ProviderId } from "@/data/types";
import { formatContext } from "@/lib/format";
import { capabilityLabels } from "@/lib/labels";
import { MAX_COMPARE } from "@/lib/constants";
import { sortModels, sortOptions, type SortKey } from "@/lib/sort";
import { ModelCard } from "./ModelCard";
import { ModelList } from "./ModelList";

type View = "liste" | "kart";

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
  // Liste varsayılan: 31 modeli göz ile karşılaştırmanın tek yolu bu.
  // Kart görünümü özet metni gösterdiği için keşif için duruyor.
  const [view, setView] = useState<View>("liste");
  const [filtersOpen, setFiltersOpen] = useState(false);

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

    return sortModels(filtered, sort);
  }, [query, activeProviders, activeCapabilities, license, minContext, sort]);

  /**
   * Katlanmış panelde duran filtreler. Filtre panelini kapatmak, kullanıcının
   * neyi süzdüğünü unutmasına yol açmamalı: etkin olan her filtre panel
   * kapalıyken de kaldırılabilir bir çip olarak görünür.
   */
  const activeFilters: { key: string; label: string; clear: () => void }[] = [
    ...[...activeProviders].map((id) => ({
      key: `s-${id}`,
      label: providers.find((p) => p.id === id)?.name ?? id,
      clear: () => setActiveProviders((s) => toggleFrom(s, id)),
    })),
    ...[...activeCapabilities].map((cap) => ({
      key: `y-${cap}`,
      label: capabilityLabels[cap],
      clear: () => setActiveCapabilities((s) => toggleFrom(s, cap)),
    })),
    ...(license !== "tumu"
      ? [
          {
            key: "l",
            label:
              licenseOptions.find((o) => o.value === license)?.label ?? license,
            clear: () => setLicense("tumu"),
          },
        ]
      : []),
    ...(minContext !== 0
      ? [
          {
            key: "b",
            label: `Bağlam ${formatContext(minContext)}+`,
            clear: () => setMinContext(0),
          },
        ]
      : []),
  ];

  const hasFilters = query !== "" || activeFilters.length > 0;

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
      {/* ------------------------------------------------------- araç çubuğu */}
      <section aria-label="Filtreler ve sıralama">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label htmlFor="arama" className="sr-only">
              Model ara
            </label>
            <input
              id="arama"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Model veya sağlayıcı ara — örn. Claude, Gemini, Kumru"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm placeholder:text-text-faint focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="filtre-paneli"
              className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                activeFilters.length > 0
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border hover:border-border-strong"
              }`}
            >
              Filtreler
              {activeFilters.length > 0 ? (
                <span className="rounded-full bg-accent px-1.5 text-xs text-accent-contrast tabular-nums">
                  {activeFilters.length}
                </span>
              ) : null}
              <span aria-hidden className="text-text-faint">
                {filtersOpen ? "▴" : "▾"}
              </span>
            </button>

            <div className="min-w-0 flex-1 sm:flex-none">
              <label htmlFor="siralama" className="sr-only">
                Sıralama
              </label>
              <select
                id="siralama"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:border-accent focus:outline-none sm:w-auto"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        {activeFilters.length > 0 ? (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {activeFilters.map((filter) => (
              <li key={filter.key}>
                <button
                  type="button"
                  onClick={filter.clear}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
                >
                  {filter.label}
                  <span aria-hidden>×</span>
                  <span className="sr-only">filtresini kaldır</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {filtersOpen ? (
          <div
            id="filtre-paneli"
            className="mt-3 space-y-3 rounded-xl border border-border bg-surface p-4"
          >
            <FilterRow label="Sağlayıcı">
              {providers.map((provider) => (
                <Chip
                  key={provider.id}
                  active={activeProviders.has(provider.id)}
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
              ))}
            </FilterRow>

            <FilterRow label="Yetenek">
              {allCapabilities.map((cap) => (
                <Chip
                  key={cap}
                  active={activeCapabilities.has(cap)}
                  onClick={() => setActiveCapabilities((s) => toggleFrom(s, cap))}
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

            <FilterRow label="Bağlam">
              {contextOptions.map((option) => (
                <Chip
                  key={option.value}
                  active={minContext === option.value}
                  onClick={() => setMinContext(option.value)}
                >
                  {option.label}
                </Chip>
              ))}
            </FilterRow>
          </div>
        ) : null}
      </section>

      {/* ---------------------------------------------------------- sonuç */}
      <div className="mt-5 flex items-baseline justify-between">
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
        <div className="mt-4 rounded-xl border border-dashed border-border-strong p-12 text-center">
          <p className="font-medium">Bu filtrelerle eşleşen model yok.</p>
          <p className="mt-1 text-sm text-text-muted">
            Bir yetenek veya sağlayıcı seçimini kaldırmayı deneyin.
          </p>
        </div>
      ) : view === "liste" ? (
        <div className="mt-3">
          <ModelList
            models={visible}
            selected={selected}
            maxSelected={MAX_COMPARE}
            sort={sort}
            onSort={setSort}
            onToggle={toggleSelected}
          />
        </div>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (view: View) => void;
}) {
  const options: { value: View; label: string; icon: React.ReactNode }[] = [
    {
      value: "liste",
      label: "Liste görünümü",
      icon: (
        <>
          <path d="M2 4h12M2 8h12M2 12h12" />
        </>
      ),
    },
    {
      value: "kart",
      label: "Kart görünümü",
      icon: (
        <>
          <rect x="2" y="2" width="5" height="5" />
          <rect x="9" y="2" width="5" height="5" />
          <rect x="2" y="9" width="5" height="5" />
          <rect x="9" y="9" width="5" height="5" />
        </>
      ),
    },
  ];

  return (
    <div className="flex shrink-0 rounded-lg border border-border p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={view === option.value}
          title={option.label}
          className={`rounded-md p-1.5 transition-colors ${
            view === option.value
              ? "bg-surface-2 text-text"
              : "text-text-faint hover:text-text"
          }`}
        >
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {option.icon}
          </svg>
          <span className="sr-only">{option.label}</span>
        </button>
      ))}
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
