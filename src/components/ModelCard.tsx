"use client";

import Link from "next/link";
import { providerMap } from "@/data/providers";
import type { Model } from "@/data/types";
import { distinctiveCapabilities } from "@/lib/catalog";
import { formatContext, formatPrice } from "@/lib/format";
import { capabilityLabels } from "@/lib/labels";

interface Props {
  model: Model;
  selected: boolean;
  disabled: boolean;
  onToggle: (slug: string) => void;
}

export function ModelCard({ model, selected, disabled, onToggle }: Props) {
  const provider = providerMap[model.providerId];
  const checkboxId = `sec-${model.slug}`;
  const capabilities = distinctiveCapabilities(model);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border-l-[3px] border-y border-r bg-surface transition-shadow hover:shadow-[0_2px_16px_-4px_rgb(0_0_0/0.10)] ${
        selected ? "border-accent ring-1 ring-accent" : "border-border"
      }`}
      // Sağlayıcı rengi kartın kimliğini taşıyan tek görsel öğe; nokta olarak
      // gösterildiğinde ızgarada hiç okunmuyordu.
      style={selected ? undefined : { borderLeftColor: provider.accent }}
    >
      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs font-medium text-text-muted">
              {provider.name}
            </span>
            <h3 className="mt-1 text-[17px] font-semibold leading-tight tracking-tight">
              {/* Kartın tamamını tıklanabilir yapar; seçim kutusu üstte kalır. */}
              <Link
                href={`/modeller/${model.slug}`}
                className="after:absolute after:inset-0 after:content-['']"
              >
                {model.name}
              </Link>
            </h3>
          </div>

          <label
            htmlFor={checkboxId}
            className={`relative z-10 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors ${
              selected
                ? "border-accent bg-accent text-accent-contrast"
                : "border-border text-text-muted hover:border-border-strong hover:text-text"
            } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
          >
            <input
              id={checkboxId}
              type="checkbox"
              className="sr-only"
              checked={selected}
              disabled={disabled}
              onChange={() => onToggle(model.slug)}
              // Görsel etiket her kartta aynı ("Karşılaştır"); ekran okuyucuda
              // hangi modelin seçildiği ancak model adıyla ayırt edilebiliyor.
              aria-label={`${model.name} modelini karşılaştırmaya ekle`}
            />
            <span aria-hidden>{selected ? "✓" : "+"}</span>
            <span>Karşılaştır</span>
          </label>
        </div>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-text-muted">
          {model.summary}
        </p>

        {/* Yalnızca ayırt edici olanlar — gerekçesi lib/catalog.ts içinde.
            Hiçbiri yoksa satır tamamen çizilmez, boş rozetle yer doldurmayız. */}
        {model.license === "acik-agirlik" || capabilities.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {model.license === "acik-agirlik" ? (
              <span className="rounded bg-open-soft px-1.5 py-0.5 font-medium text-open">
                Açık ağırlıklı
              </span>
            ) : null}
            {capabilities.map((capability) => (
              <span key={capability} className="text-text-faint">
                {capabilityLabels[capability]}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Fiyat şeridi kartın dibine sabitlenir: özet metni farklı uzunlukta
          olsa da ızgaradaki tüm kartlarda aynı hizada durur ve göz sütun
          olarak okuyabilir. */}
      <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-border bg-surface-2/60 px-5 py-3">
        <Figure label="Bağlam" value={formatContext(model.contextWindow)} />
        <Figure
          label="Girdi"
          value={model.pricing ? formatPrice(model.pricing.input) : "—"}
        />
        <Figure
          label="Çıktı"
          value={model.pricing ? formatPrice(model.pricing.output) : "—"}
        />
      </dl>
    </article>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-text-faint">
        {label}
      </dt>
      <dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
