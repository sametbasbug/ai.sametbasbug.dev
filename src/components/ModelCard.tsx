"use client";

import Link from "next/link";
import type { Model } from "@/data/types";
import { formatContext, formatPrice } from "@/lib/format";
import { capabilityLabels } from "@/lib/labels";
import { Badge, LicenseBadge, ProviderTag } from "./ui";

interface Props {
  model: Model;
  selected: boolean;
  disabled: boolean;
  onToggle: (slug: string) => void;
}

export function ModelCard({ model, selected, disabled, onToggle }: Props) {
  const checkboxId = `sec-${model.slug}`;

  return (
    <article
      className={`group relative flex flex-col rounded-xl border bg-surface p-5 transition-shadow hover:shadow-[0_2px_16px_-4px_rgb(0_0_0/0.10)] ${
        selected ? "border-accent ring-1 ring-accent" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <ProviderTag id={model.providerId} />
          <h3 className="mt-1.5 text-base font-semibold leading-tight">
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

      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        {model.summary}
      </p>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-text-faint">
            Bağlam
          </dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums">
            {formatContext(model.contextWindow)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-text-faint">
            Girdi
          </dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums">
            {model.pricing ? formatPrice(model.pricing.input) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-text-faint">
            Çıktı
          </dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums">
            {model.pricing ? formatPrice(model.pricing.output) : "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <LicenseBadge license={model.license} />
        {model.capabilities.slice(0, 3).map((cap) => (
          <Badge key={cap}>{capabilityLabels[cap]}</Badge>
        ))}
        {model.capabilities.length > 3 ? (
          <Badge>+{model.capabilities.length - 3}</Badge>
        ) : null}
      </div>
    </article>
  );
}
