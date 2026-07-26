import type { Metadata } from "next";
import Link from "next/link";
import { EquinoxMark } from "@/components/EquinoxMark";
import { JsonLd } from "@/components/JsonLd";
import { models } from "@/data/models";
import { providers } from "@/data/providers";
import {
  BLOG_URL,
  BRAND_PREFIX_UPPER,
  EQUINOX_URL,
  SITE_NAME,
} from "@/lib/brand";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Hakkında",
  description:
    "Model Atlası'nın ne olduğu, verinin nereden geldiği ve Equinox ekosistemindeki yeri.",
  alternates: { canonical: "/hakkinda/" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Modeller", path: "/" },
          { name: "Hakkında", path: "/hakkinda/" },
        ])}
      />

      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Hakkında
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Bu site ne işe yarar?
        </h1>
        <p className="mt-4 leading-relaxed text-text-muted">
          Model Atlası, yapay zekâ modellerini Türkçe olarak karşılaştırmak için
          yapılmış bağımsız bir kaynaktır. Şu an {models.length} model ve{" "}
          {providers.length} sağlayıcı listeleniyor; her modelin bağlam
          penceresi, fiyatı, girdi-çıktı kipleri ve güçlü-zayıf yönleri aynı
          ölçütlerle veriliyor.
        </p>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-semibold tracking-tight">
            Veri nereden geliyor?
          </h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Fiyatlar ve teknik özellikler sağlayıcıların resmî
            dokümantasyonundan elle derlenir. Canlı bir fiyat akışı veya bir
            veritabanı yoktur; tüm veri depodaki tek bir dosyada durur ve site
            derleme sırasında statik HTML&apos;e dökülür.
          </p>
          <p className="mt-3 leading-relaxed text-text-muted">
            Her modelin detay sayfasının altında verinin hangi adresten ve hangi
            tarihte alındığı yazılıdır. Bir değer resmî sayfada belirtilmemişse
            tahmin yazmak yerine boş bırakılır ve arayüzde &quot;—&quot; olarak
            görünür.
          </p>
          <p className="mt-3 leading-relaxed text-text-muted">
            Fiyatlar 1 milyon token başına ABD doları cinsindendir ve
            bilgilendirme amaçlıdır. Bağlayıcı fiyat için her zaman
            sağlayıcının kendi sayfasını esas alın.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight">
            Bağımsızlık
          </h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Site hiçbir sağlayıcıyla bağlantılı değildir. Sıralamalar, ölçütler
            ve listeye alınan modeller sponsorluk veya yönlendirme bağlantısı
            içermez. Modeller arasında bir &quot;en iyi&quot; seçilmez;
            karşılaştırma ölçütleri verilir, karar okuyucuya bırakılır.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center gap-3">
            <EquinoxMark className="h-10 w-10 shrink-0" />
            <div>
              <p className="font-mono text-[10px] font-semibold leading-none tracking-[0.18em] text-eq-gold-ink">
                {BRAND_PREFIX_UPPER}
              </p>
              <h2 className="mt-1.5 text-xl font-semibold leading-none tracking-tight">
                Ekosistem
              </h2>
            </div>
          </div>
          <p className="mt-4 leading-relaxed text-text-muted">
            {SITE_NAME}, Samet Başbuğ&apos;un Equinox adını taşıyan küçük web
            ekosistemindeki yayın yüzeylerinden biridir. Ekosistemdeki diğer
            yüzeylerin güncel listesi Equinox giriş sayfasında durur.
          </p>
          <ul className="mt-5 divide-y divide-border border-t border-border">
            <li>
              <a
                href={EQUINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3 transition-colors hover:text-accent"
              >
                <span className="text-sm font-medium">Equinox</span>
                <span className="text-xs text-text-faint">
                  Ekosistemin giriş sayfası
                </span>
                <span className="ml-auto text-xs text-text-muted">
                  equinox.sametbasbug.dev ↗
                </span>
              </a>
            </li>
            <li>
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3 transition-colors hover:text-accent"
              >
                <span className="text-sm font-medium">Ana blog</span>
                <span className="text-xs text-text-faint">
                  Yazılar, notlar ve sözlük
                </span>
                <span className="ml-auto text-xs text-text-muted">
                  sametbasbug.dev ↗
                </span>
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight">
            Eksik veya yanlış bir şey mi var?
          </h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            Model fiyatları ve kimlikleri sık değişir. Güncel olmayan bir değer
            görürseniz veya listede olması gereken bir model eksikse, ana blog
            üzerinden iletişime geçebilirsiniz.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            Model listesine dön
          </Link>
        </section>
      </div>
    </div>
  );
}
