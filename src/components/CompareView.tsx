"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { modelMap, models } from "@/data/models";
import { providerMap } from "@/data/providers";
import type { Capability, Model } from "@/data/types";
import {
  formatContext,
  formatDate,
  formatParameters,
  formatPrice,
  formatTokens,
} from "@/lib/format";
import { capabilityLabels, licenseLabels, modalityLabels } from "@/lib/labels";
import { MAX_COMPARE } from "@/lib/constants";
import { baseValidUpTo, tierRows } from "@/lib/pricing";

const allCapabilities = Object.keys(capabilityLabels) as Capability[];

/** Bir satırda hangi değerin "en iyi" olduğunu işaretlemek için. */
type Best = "yuksek" | "dusuk" | null;

export function CompareView() {
  const searchParams = useSearchParams();
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState("");

  // URL tek doğruluk kaynağı: geri/ileri tuşları ve paylaşılan bağlantılar
  // ayrı bir durum kopyası tutmadan doğru çalışır.
  const slugs = useMemo(() => {
    const raw = searchParams.getAll("m");
    return [...new Set(raw)]
      .filter((slug) => modelMap.has(slug))
      .slice(0, MAX_COMPARE);
  }, [searchParams]);

  const selected = useMemo(
    () =>
      slugs
        .map((slug) => models.find((m) => m.slug === slug))
        .filter((m): m is Model => Boolean(m)),
    [slugs],
  );

  // `router.replace` statik dışa aktarımda sessizce hiçbir şey yapmıyor: adres
  // de bileşen de güncellenmiyor. `history.replaceState` ise Next tarafından
  // desteklenen yol — adresi değiştirir ve `useSearchParams`'ı yeniden tetikler.
  const sync = useCallback((next: string[]) => {
    const query = next.map((s) => `m=${encodeURIComponent(s)}`).join("&");
    window.history.replaceState(
      null,
      "",
      query ? `/karsilastir/?${query}` : "/karsilastir/",
    );
  }, []);

  const remove = (slug: string) => sync(slugs.filter((s) => s !== slug));

  const add = (slug: string) => {
    if (slugs.includes(slug) || slugs.length >= MAX_COMPARE) return;
    sync([...slugs, slug]);
    setPicking(false);
    setQuery("");
  };

  const addable = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    return models
      .filter((m) => !slugs.includes(m.slug))
      .filter(
        (m) =>
          !needle ||
          `${m.name} ${providerMap[m.providerId].name}`
            .toLocaleLowerCase("tr-TR")
            .includes(needle),
      );
  }, [slugs, query]);

  if (selected.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border-strong p-12 text-center">
        <p className="text-lg font-medium">Henüz model seçilmedi.</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-muted">
          Karşılaştırmak için model listesine dönüp kartlardaki “Karşılaştır”
          düğmesine basın. En fazla {MAX_COMPARE} model seçebilirsiniz.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:bg-accent-hover"
        >
          Modellere göz at
        </Link>
      </div>
    );
  }

  // Satır bazında en iyi değeri bulmak için yardımcılar.
  const bestOf = (values: (number | null)[], direction: Best): number | null => {
    if (!direction) return null;
    const valid = values.filter((v): v is number => v !== null);
    if (valid.length < 2) return null;
    return direction === "yuksek" ? Math.max(...valid) : Math.min(...valid);
  };

  const contextBest = bestOf(
    selected.map((m) => m.contextWindow),
    "yuksek",
  );
  const inputBest = bestOf(
    selected.map((m) => m.pricing?.input ?? null),
    "dusuk",
  );
  const outputBest = bestOf(
    selected.map((m) => m.pricing?.output ?? null),
    "dusuk",
  );

  const columnWidth = `${100 / (selected.length + 1)}%`;

  /**
   * Fiyat satırlarının altındaki açıklama. Kademeli bir modelde taban fiyatın
   * nereye kadar geçerli olduğunu yazmazsak sütunlar yanlış okunur: 0,03 $ ile
   * 0,14 $ yan yana durur ama biri yalnızca 32 bin token'a kadar geçerlidir.
   */
  const priceHint = (model: Model) => {
    if (!model.pricing) return "açık ağırlık";
    const limit = baseValidUpTo(model.pricing);
    return limit ? `1M token · ${formatContext(limit)} token'a kadar` : "1M token";
  };

  /** Kademe, kampanya ve serbest not — hepsi tek satırda. */
  const priceDetails = (model: Model): string[] => {
    if (!model.pricing) return ["Token ücreti yok"];
    const rows = tierRows(model.pricing).map(
      (tier) =>
        `${tier.label}: ${formatPrice(tier.input)} / ${formatPrice(tier.output)}`,
    );
    const details = rows.length > 0 ? rows : ["Bağlam boyunca tek fiyat"];
    const promo = model.pricing.promo;
    if (promo) {
      details.push(
        `${formatDate(promo.until)} tarihine kadar tanıtım fiyatı: ${formatPrice(
          promo.input,
        )} / ${formatPrice(promo.output)}`,
      );
    }
    if (model.pricing.note) details.push(model.pricing.note);
    return details;
  };

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------- seçim çubuğu */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-text-muted">
          {selected.length} / {MAX_COMPARE} model
        </span>
        {selected.length < MAX_COMPARE ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setPicking((p) => !p)}
              aria-expanded={picking}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-border-strong"
            >
              + Model ekle
            </button>

            {picking ? (
              <div className="absolute left-0 top-full z-30 mt-2 w-80 rounded-xl border border-border bg-surface p-2 shadow-lg">
                <label htmlFor="ekle-ara" className="sr-only">
                  Model ara
                </label>
                <input
                  id="ekle-ara"
                  type="search"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ara…"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
                <ul className="mt-2 max-h-72 overflow-y-auto">
                  {addable.length === 0 ? (
                    <li className="px-3 py-4 text-center text-sm text-text-faint">
                      Sonuç yok
                    </li>
                  ) : (
                    addable.map((m) => (
                      <li key={m.slug}>
                        <button
                          type="button"
                          onClick={() => add(m.slug)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-surface-2"
                        >
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor:
                                providerMap[m.providerId].accent,
                            }}
                          />
                          <span className="truncate">{m.name}</span>
                          <span className="ml-auto shrink-0 text-xs text-text-faint tabular-nums">
                            {formatContext(m.contextWindow)}
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <span className="text-sm text-text-faint">
            Azami sayıya ulaşıldı — eklemek için birini çıkarın.
          </span>
        )}

        <Link
          href="/"
          className="ml-auto text-sm text-text-muted underline-offset-4 hover:text-text hover:underline"
        >
          Model listesine dön
        </Link>
      </div>

      {/* -------------------------------------------------------- tablo */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] border-collapse bg-surface text-sm">
          <caption className="sr-only">
            Seçilen yapay zekâ modellerinin teknik özellik karşılaştırması
          </caption>
          <colgroup>
            <col style={{ width: columnWidth }} />
            {selected.map((m) => (
              <col key={m.slug} style={{ width: columnWidth }} />
            ))}
          </colgroup>

          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="p-4 text-left align-bottom">
                <span className="text-xs font-medium uppercase tracking-wide text-text-faint">
                  Özellik
                </span>
              </th>
              {selected.map((model) => (
                <th
                  key={model.slug}
                  scope="col"
                  className="border-l border-border p-4 text-left align-bottom"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="flex items-center gap-1.5 text-xs text-text-muted">
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              providerMap[model.providerId].accent,
                          }}
                        />
                        {providerMap[model.providerId].name}
                      </span>
                      <Link
                        href={`/modeller/${model.slug}`}
                        className="mt-1 block text-base font-semibold leading-tight underline-offset-4 hover:underline"
                      >
                        {model.name}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(model.slug)}
                      className="shrink-0 rounded p-1 text-text-faint hover:bg-surface-2 hover:text-text"
                    >
                      <span aria-hidden>×</span>
                      <span className="sr-only">
                        {model.name} modelini karşılaştırmadan çıkar
                      </span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <Row
              label="Lisans"
              cells={selected.map((m) => licenseLabels[m.license])}
            />
            <Row
              label="Bağlam penceresi"
              mono
              cells={selected.map((m) => formatContext(m.contextWindow))}
              hints={selected.map((m) => formatTokens(m.contextWindow))}
              highlight={selected.map((m) => m.contextWindow === contextBest)}
            />
            <Row
              label="Azami çıktı"
              mono
              cells={selected.map((m) =>
                m.maxOutput ? formatContext(m.maxOutput) : "—",
              )}
            />
            <Row
              label="Girdi fiyatı"
              mono
              cells={selected.map((m) =>
                m.pricing ? formatPrice(m.pricing.input) : "Ücretsiz*",
              )}
              hints={selected.map(priceHint)}
              highlight={selected.map(
                (m) => m.pricing?.input === inputBest,
              )}
            />
            <Row
              label="Çıktı fiyatı"
              mono
              cells={selected.map((m) =>
                m.pricing ? formatPrice(m.pricing.output) : "Ücretsiz*",
              )}
              hints={selected.map(priceHint)}
              highlight={selected.map(
                (m) => m.pricing?.output === outputBest,
              )}
            />
            <Row
              label="Önbellekli girdi"
              mono
              cells={selected.map((m) =>
                m.pricing?.cachedInput !== undefined
                  ? formatPrice(m.pricing.cachedInput)
                  : "—",
              )}
            />
            <ListRow
              label="Fiyat ayrıntısı"
              marker="·"
              markerClass="text-text-faint"
              cells={selected.map((m) => ({
                key: m.slug,
                items: priceDetails(m),
              }))}
            />
            <Row
              label="Parametre"
              mono
              cells={selected.map((m) =>
                m.parameters ? formatParameters(m.parameters) : "Açıklanmadı",
              )}
            />
            <Row
              label="Girdi kipleri"
              cells={selected.map((m) =>
                m.inputModalities.map((x) => modalityLabels[x]).join(", "),
              )}
            />
            <Row label="API kimliği" code cells={selected.map((m) => m.apiId)} />

            <tr className="border-t-2 border-border-strong bg-surface-2">
              <th
                colSpan={selected.length + 1}
                scope="colgroup"
                className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-text-faint"
              >
                Yetenekler
              </th>
            </tr>
            {allCapabilities.map((cap) => (
              <tr key={cap} className="border-t border-border">
                <th
                  scope="row"
                  className="p-4 text-left align-top text-sm font-medium"
                >
                  {capabilityLabels[cap]}
                </th>
                {selected.map((model) => {
                  const has = model.capabilities.includes(cap);
                  return (
                    <td
                      key={model.slug}
                      className="border-l border-border p-4 align-top"
                    >
                      <span
                        className={has ? "text-open" : "text-text-faint"}
                        aria-hidden
                      >
                        {has ? "✓" : "—"}
                      </span>
                      <span className="sr-only">
                        {has ? "destekliyor" : "desteklemiyor"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}

            <tr className="border-t-2 border-border-strong bg-surface-2">
              <th
                colSpan={selected.length + 1}
                scope="colgroup"
                className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-text-faint"
              >
                Değerlendirme
              </th>
            </tr>
            <ListRow
              label="Güçlü yönleri"
              marker="✓"
              markerClass="text-open"
              cells={selected.map((m) => ({ key: m.slug, items: m.strengths }))}
            />
            <ListRow
              label="Dikkat edilmesi gerekenler"
              marker="!"
              markerClass="text-accent"
              cells={selected.map((m) => ({
                key: m.slug,
                items: m.weaknesses,
              }))}
            />
            <ListRow
              label="Kullanım senaryoları"
              marker="·"
              markerClass="text-text-faint"
              cells={selected.map((m) => ({ key: m.slug, items: m.useCases }))}
            />
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-faint">
        * Açık ağırlıklı modellerde token ücreti yoktur; donanım ve işletme
        maliyeti size aittir. Vurgulanan hücreler o satırdaki en avantajlı
        değeri gösterir.
      </p>
    </div>
  );
}

function Row({
  label,
  cells,
  hints,
  highlight,
  mono = false,
  code = false,
}: {
  label: string;
  cells: string[];
  hints?: string[];
  highlight?: boolean[];
  /** Sayısal satır: sütunlar arası hizalama için sabit genişlikli rakamlar. */
  mono?: boolean;
  /** Kod satırı: gerçekten daktilo fontu gerektiren değerler (API kimliği). */
  code?: boolean;
}) {
  return (
    <tr className="border-t border-border">
      <th scope="row" className="p-4 text-left align-top text-sm font-medium">
        {label}
      </th>
      {cells.map((cell, i) => (
        <td
          key={i}
          className={`border-l border-border p-4 align-top ${
            highlight?.[i] ? "bg-accent-soft" : ""
          }`}
        >
          <span
            className={`${mono ? "tabular-nums" : ""} ${
              code ? "break-all font-mono text-xs text-text-muted" : ""
            } ${highlight?.[i] ? "font-semibold text-accent" : ""}`}
          >
            {cell}
          </span>
          {hints?.[i] ? (
            <span className="mt-0.5 block text-xs text-text-faint">
              {hints[i]}
            </span>
          ) : null}
        </td>
      ))}
    </tr>
  );
}

function ListRow({
  label,
  cells,
  marker,
  markerClass,
}: {
  label: string;
  cells: { key: string; items: string[] }[];
  marker: string;
  markerClass: string;
}) {
  return (
    <tr className="border-t border-border">
      <th scope="row" className="p-4 text-left align-top text-sm font-medium">
        {label}
      </th>
      {cells.map((cell) => (
        <td key={cell.key} className="border-l border-border p-4 align-top">
          <ul className="space-y-2">
            {cell.items.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed">
                <span aria-hidden className={`shrink-0 ${markerClass}`}>
                  {marker}
                </span>
                <span className="text-text-muted">{item}</span>
              </li>
            ))}
          </ul>
        </td>
      ))}
    </tr>
  );
}
