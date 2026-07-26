import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareView } from "@/components/CompareView";
import { JsonLd } from "@/components/JsonLd";
import { MAX_COMPARE } from "@/lib/constants";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Model karşılaştırma",
  description:
    "Yapay zekâ modellerini bağlam penceresi, fiyat, yetenek ve kullanım senaryolarına göre yan yana karşılaştırın.",
  // Seçim `?m=` parametrelerinde tutuluyor; her kombinasyon ayrı bir adres
  // üretir ama hepsi aynı sayfadır. Kanonik adres parametresiz biçim olmalı,
  // yoksa arama motoru sayısız kopya sayfa görür.
  alternates: { canonical: "/karsilastir/" },
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Modeller", path: "/" },
          { name: "Karşılaştır", path: "/karsilastir/" },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Model karşılaştırma
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-text-muted">
          En fazla {MAX_COMPARE} modeli yan yana inceleyin. Bağlantı seçiminizi
          taşır — bu sayfayı olduğu gibi paylaşabilirsiniz.
        </p>
      </header>

      {/*
        Seçim `?m=` parametresinden okunur. Site statik dışa aktarıldığı için
        bu okuma istemcide yapılır; `useSearchParams` bir Suspense sınırı ister.
      */}
      <Suspense
        fallback={
          <div
            aria-hidden
            className="h-64 animate-pulse rounded-xl border border-border bg-surface"
          />
        }
      >
        <CompareView />
      </Suspense>
    </div>
  );
}
