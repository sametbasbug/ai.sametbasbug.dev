"use client";

import Link from "next/link";
import { providerMap } from "@/data/providers";
import type { Model } from "@/data/types";
import { distinctiveCapabilities, pricePosition } from "@/lib/catalog";
import { formatContext, formatPrice } from "@/lib/format";
import { capabilityLabels } from "@/lib/labels";
import type { SortKey } from "@/lib/sort";

/**
 * Yoğun liste görünümü.
 *
 * Kart ızgarasının çözemediği sorunu çözer: 31 modeli göz ile karşılaştırmak.
 * Fiyatlar aynı sütunda hizalandığında okuyucu karşılaştırmayı kendisi yapar,
 * kartlarda ise her sayı kendi kutusunda durduğu için karşılaştırma
 * yapılamıyordu.
 *
 * Sütun şablonu tek yerde tanımlı ve hem başlık hem satırlar tarafından
 * kullanılıyor; ayrı yazılsalardı sütunlar er geç kayardı.
 *
 * Izgara yalnızca `sm` ve üstünde devrede. Dar ekranda satır düşey bir yığın:
 * önce ad ve seçim düğmesi, altında üç ölçü. Izgarayı dar ekranda da kullanmayı
 * denedim ve düzen ters döndü — CSS ızgarası, satırı açıkça belirtilmiş öğeleri
 * (`row-start-1`) otomatik yerleşenlerden **önce** yerleştirir, dolayısıyla
 * seçim düğmesi ilk sütunu kapıp model adını sağa itiyordu.
 */
const COLUMNS =
  "sm:grid-cols-[minmax(0,1fr)_4.5rem_5.5rem_5.5rem_4.5rem] sm:items-center sm:gap-x-4";

/** Sütun başlığına basınca hangi sıralamaya geçilecek. */
const nextSort: Record<string, (current: SortKey) => SortKey> = {
  isim: () => "isim",
  baglam: () => "baglam",
  girdi: (current) =>
    current === "girdi-ucuz" ? "girdi-pahali" : "girdi-ucuz",
  cikti: (current) =>
    current === "cikti-ucuz" ? "cikti-pahali" : "cikti-ucuz",
};

function sortIndicator(column: string, sort: SortKey): string {
  if (column === "isim") return sort === "isim" ? "↓" : "";
  if (column === "baglam") return sort === "baglam" ? "↓" : "";
  if (column === "girdi") {
    if (sort === "girdi-ucuz") return "↑";
    if (sort === "girdi-pahali") return "↓";
    return "";
  }
  if (sort === "cikti-ucuz") return "↑";
  if (sort === "cikti-pahali") return "↓";
  return "";
}

interface Props {
  models: Model[];
  selected: string[];
  maxSelected: number;
  sort: SortKey;
  onSort: (key: SortKey) => void;
  onToggle: (slug: string) => void;
}

export function ModelList({
  models,
  selected,
  maxSelected,
  sort,
  onSort,
  onToggle,
}: Props) {
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {/* Başlık satırı yalnızca geniş ekranda: dar ekranda her satır kendi
          etiketlerini taşıyor, çünkü sütunlar alt alta iniyor. */}
        <div
          className={`${COLUMNS} hidden border-b border-border bg-surface-2 px-4 py-2 sm:grid`}
        >
          <SortHeader column="isim" sort={sort} onSort={onSort}>
            Model
          </SortHeader>
          <SortHeader column="baglam" sort={sort} onSort={onSort} align="right">
            Bağlam
          </SortHeader>
          <SortHeader column="girdi" sort={sort} onSort={onSort} align="right">
            Girdi
          </SortHeader>
          <SortHeader column="cikti" sort={sort} onSort={onSort} align="right">
            Çıktı
          </SortHeader>
          {/* Sütun adı bir kez burada yazılıyor; satırlardaki düğmeler yalnızca
            "+" taşıyor. Önceki hâlinde "Karşılaştır" kelimesi listede otuz bir
            kez tekrar ediyor ve sayıların önüne geçiyordu. */}
          <span className="text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-text-faint">
            Karşılaştır
          </span>
        </div>

        <ul>
          {models.map((model) => (
            <ModelRow
              key={model.slug}
              model={model}
              selected={selected.includes(model.slug)}
              disabled={
                !selected.includes(model.slug) && selected.length >= maxSelected
              }
              onToggle={onToggle}
            />
          ))}
        </ul>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-text-faint">
        Çıktı fiyatının altındaki çizgi, o fiyatın katalogdaki yerini gösterir;
        ölçek logaritmiktir çünkü en ucuz ile en pahalı arasında binden fazla
        kat var.
      </p>
    </>
  );
}

function SortHeader({
  column,
  sort,
  onSort,
  align = "left",
  children,
}: {
  column: keyof typeof nextSort;
  sort: SortKey;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  const indicator = sortIndicator(column, sort);
  return (
    <button
      type="button"
      onClick={() => onSort(nextSort[column](sort))}
      className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors hover:text-text ${
        align === "right" ? "justify-end" : ""
      } ${indicator ? "text-accent" : "text-text-faint"}`}
    >
      {children}
      <span aria-hidden className="w-2">
        {indicator}
      </span>
    </button>
  );
}

function ModelRow({
  model,
  selected,
  disabled,
  onToggle,
}: {
  model: Model;
  selected: boolean;
  disabled: boolean;
  onToggle: (slug: string) => void;
}) {
  const provider = providerMap[model.providerId];
  const capabilities = distinctiveCapabilities(model);
  const checkboxId = `liste-${model.slug}`;

  return (
    <li>
      <div
        // Soldaki renk şeridi sağlayıcının rengi: listeye ritim ve renk veren
        // tek şey bu. Sağlayıcı rengi daha önce yalnızca 8 px'lik bir noktada
        // duruyordu ve sayfada hiç okunmuyordu.
        className={`${COLUMNS} relative flex flex-col gap-2.5 border-b border-l-[3px] border-b-border px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-2 sm:grid ${
          selected ? "bg-accent-soft" : ""
        }`}
        style={{ borderLeftColor: provider.accent }}
      >
        {/* Dar ekranda ad ile seçim düğmesi tek satırda; geniş ekranda bu
            sarmalayıcı yok olur ve ikisi doğrudan ızgara hücresi olur. */}
        <div className="flex items-center justify-between gap-3 sm:contents">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold leading-tight">
              <Link
                href={`/modeller/${model.slug}`}
                className="after:absolute after:inset-0 after:content-['']"
              >
                {model.name}
              </Link>
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
              <span>{provider.name}</span>
              {model.license === "acik-agirlik" ? (
                <span className="rounded bg-open-soft px-1.5 py-0.5 text-[11px] font-medium text-open">
                  Açık ağırlıklı
                </span>
              ) : null}
              {capabilities.map((capability) => (
                <span key={capability} className="text-text-faint">
                  {capabilityLabels[capability]}
                </span>
              ))}
            </p>
          </div>

          <SelectToggle
            id={checkboxId}
            model={model}
            selected={selected}
            disabled={disabled}
            onToggle={onToggle}
          />
        </div>

        <div className="flex gap-6 sm:contents">
          <Metric label="Bağlam" value={formatContext(model.contextWindow)} />
          <Metric
            label="Girdi"
            value={model.pricing ? formatPrice(model.pricing.input) : "—"}
          />
          <Metric
            label="Çıktı"
            value={model.pricing ? formatPrice(model.pricing.output) : "—"}
            bar={model.pricing ? pricePosition(model.pricing.output) : null}
          />
        </div>
      </div>
    </li>
  );
}

function SelectToggle({
  id,
  model,
  selected,
  disabled,
  onToggle,
}: {
  id: string;
  model: Model;
  selected: boolean;
  disabled: boolean;
  onToggle: (slug: string) => void;
}) {
  return (
    <label
      htmlFor={id}
      title={`${model.name} modelini karşılaştırmaya ekle`}
      // `sm:order-last` gerekli: geniş ekranda sarmalayıcı `display: contents`
      // olduğu için bu düğme ölçülerden önce gelir ve ikinci sütuna düşerdi.
      // Izgara yerleşimi `order` ile değiştirilmiş belge sırasını izler.
      className={`relative z-10 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border text-sm transition-colors sm:order-last sm:justify-self-center ${
        selected
          ? "border-accent bg-accent text-accent-contrast"
          : "border-border text-text-muted hover:border-border-strong hover:text-text"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={selected}
        disabled={disabled}
        onChange={() => onToggle(model.slug)}
        aria-label={`${model.name} modelini karşılaştırmaya ekle`}
      />
      <span aria-hidden>{selected ? "✓" : "+"}</span>
    </label>
  );
}

function Metric({
  label,
  value,
  bar,
}: {
  label: string;
  value: string;
  /** 0–1 arası fiyat konumu; verilirse değerin altına ince bir ölçek çizilir. */
  bar?: number | null;
}) {
  return (
    <div className="sm:text-right">
      {/* Etiket dar ekranda gerekli, geniş ekranda başlık satırı zaten söylüyor. */}
      <span className="block text-[10px] uppercase tracking-wide text-text-faint sm:hidden">
        {label}
      </span>
      <span className="block text-sm font-medium tabular-nums">{value}</span>
      {bar != null ? (
        <span
          aria-hidden
          className="mt-1 block h-0.5 rounded-full bg-border-strong"
          style={{ width: `${Math.round(bar * 100)}%`, marginLeft: "auto" }}
        />
      ) : null}
    </div>
  );
}
