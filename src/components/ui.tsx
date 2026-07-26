import type { ReactNode } from "react";
import type { License } from "@/data/types";
import { licenseLabels } from "@/lib/labels";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "open";
}) {
  const tones = {
    neutral: "bg-surface-2 text-text-muted border-border",
    accent: "bg-accent-soft text-accent border-accent/25",
    open: "bg-open-soft text-open border-open/25",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function LicenseBadge({ license }: { license: License }) {
  return (
    <Badge tone={license === "acik-agirlik" ? "open" : "neutral"}>
      {licenseLabels[license]}
    </Badge>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-text-faint">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium tabular-nums">{value}</dd>
      {hint ? <p className="mt-0.5 text-xs text-text-faint">{hint}</p> : null}
    </div>
  );
}
