import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { BackToTop } from "@/components/BackToTop";
import { DataFreshness } from "@/components/DataFreshness";
import { InlineScript } from "@/components/InlineScript";
import { ModelAtlasMark } from "@/components/ModelAtlasMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  BLOG_URL,
  BRAND_NAME,
  BRAND_PREFIX,
  BRAND_PREFIX_UPPER,
  EQUINOX_URL,
  ORBIT_URL,
  REPORT_URL,
  SITE_NAME,
} from "@/lib/brand";
import { SITE_URL } from "@/lib/constants";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// latin-ext, Türkçe'ye özgü ğ/ı/İ/ş karakterleri için gerekli.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Yapay zekâ modellerini keşfedin ve karşılaştırın`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Claude, GPT, Gemini, Grok, Llama, Kumru ve daha fazlası. Yapay zekâ modellerini bağlam penceresi, fiyat ve yeteneklerine göre Türkçe olarak keşfedin ve yan yana karşılaştırın.",
  applicationName: SITE_NAME,
  creator: BRAND_PREFIX,
  publisher: BRAND_PREFIX,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
};

const navLinks = [
  { href: "/", label: "Modeller" },
  { href: "/karsilastir", label: "Karşılaştır" },
  // Dar ekranda dört bağlantı + tema düğmesi sığsın diye kısa etiket.
  { href: "/hesaplayici", label: "Maliyet" },
  { href: "/saglayicilar", label: "Sağlayıcılar" },
];

/**
 * Altbilgideki ağ bağlantıları. Bilerek kısa: kardeş yüzeylerin güncel
 * listesi Equinox giriş sayfasında durur, burada çoğaltılırsa bir yüzey
 * kapandığında iki yerden birinin bayatlaması kaçınılmaz olur.
 */
const networkLinks = [
  {
    href: EQUINOX_URL,
    label: "Ana kapı",
    host: "equinox.sametbasbug.dev",
  },
  {
    href: ORBIT_URL,
    label: "Orbit",
    host: "orbit.sametbasbug.dev",
  },
  {
    href: BLOG_URL,
    label: "Ana blog",
    host: "sametbasbug.dev",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // Satır içi tema betiği `data-theme` özniteliğini React hidrasyondan
      // önce yazar, dolayısıyla sunucu çıktısıyla istemci DOM'u burada bilerek
      // ayrışır. Uyarı bastırılmazsa React her yüklemede hidrasyon uyuşmazlığı
      // hatası verir. Bastırma yalnızca bu öğenin kendi özniteliklerini
      // kapsar, alt ağacı değil.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        {/* İçerikten önce çalışmalı — gerekçesi lib/theme.ts içinde.
            Sarmalayıcının neden gerektiği InlineScript.tsx içinde. */}
        <InlineScript html={themeInitScript} />

        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
        >
          İçeriğe geç
        </a>

        <header className="sticky top-0 z-40 border-b border-border bg-bg/88 backdrop-blur">
          <div aria-hidden className="atlas-brand-rail h-0.5" />
          {/*
           * Dar ekranda başlık iki satır: üstte marka ve tema düğmesi, altta
           * menü. Tek satıra sığmıyor — ölçüldü, 375 px'te menü tek başına
           * 300 px yiyor, marka yazısı 85 px daha istiyor, 88 px taşıyordu.
           * Eskiden yazı `min-[420px]` eşiğine bağlıydı; yaygın telefonların
           * hepsi (390, 393, 402) o eşiğin altında olduğu için marka adı
           * fiilen hiçbir telefonda görünmüyordu.
           *
           * Sarma `flex-wrap` ile yapılıyor: menü `w-full` olduğu için dar
           * ekranda kendi satırına düşer, `sm` üstünde `w-auto` olup aynı
           * satıra döner. Tema düğmesi `sm:order-last` ile geniş ekranda
           * menünün sağına geçer — bu yüzden `nav` içinde değil, dışında.
           */}
          <div className="mx-auto flex max-w-6xl flex-wrap items-center px-4 sm:flex-nowrap sm:gap-6 sm:px-6">
            <Link
              href="/"
              className="group flex h-14 items-center gap-2.5 rounded-md sm:h-16"
              aria-label={`${SITE_NAME} ana sayfa`}
            >
              <ModelAtlasMark className="h-9 w-9 shrink-0 transition-transform duration-200 group-hover:-rotate-2 group-hover:scale-[1.03] sm:h-10 sm:w-10" />
              <span className="whitespace-nowrap">
                <span className="block font-mono text-[9px] font-semibold leading-none tracking-[0.2em] text-eq-gold-ink">
                  {BRAND_PREFIX_UPPER}
                </span>
                <span className="mt-1 block text-[15px] font-semibold leading-none tracking-[-0.025em]">
                  {BRAND_NAME}
                </span>
              </span>
            </Link>

            {/* `sm:ml-0` şart: menüde de `sm:ml-auto` var ve iki otomatik
                kenar boşluğu artan yeri paylaşınca menü ile tema düğmesinin
                arası geniş ekranda açılıyor. */}
            <div className="ml-auto flex h-14 items-center sm:order-last sm:ml-0 sm:h-16">
              <ThemeToggle />
            </div>

            <nav
              aria-label="Ana menü"
              className="flex w-full items-center gap-0.5 border-t border-border pb-1.5 sm:ml-auto sm:w-auto sm:gap-1 sm:border-0 sm:pb-0"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  // Dar ekranda bağlantılar satırı eşit paylaşır: dokunma
                  // hedefi büyür ve menü ortalanmış görünür.
                  className="flex-1 rounded-md px-1.5 py-2 text-center text-xs text-text-muted transition-colors hover:bg-surface-2 hover:text-text sm:flex-none sm:px-3 sm:text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main id="icerik" className="flex-1">
          {children}
        </main>

        <footer className="relative mt-20 border-t border-border bg-surface">
          <div aria-hidden className="atlas-brand-rail absolute inset-x-0 top-0 h-px opacity-70" />
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="max-w-sm">
                <div className="flex items-center gap-2.5">
                  <ModelAtlasMark className="h-9 w-9 shrink-0" />
                  <div>
                    <p className="font-mono text-[9px] font-semibold leading-none tracking-[0.18em] text-eq-gold-ink">
                      {BRAND_PREFIX_UPPER}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-none">
                      {BRAND_NAME}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  Yapay zekâ modellerinin arasındaki farkı okunur hâle getiren
                  bağımsız Türkçe rehber.
                </p>
              </div>
              <div className="text-sm text-text-muted">
                <p className="font-medium text-text">Veri hakkında</p>
                <p className="mt-3 max-w-xs leading-relaxed">
                  Fiyat ve teknik özellikler sağlayıcıların resmî
                  dokümantasyonundan derlenir. Her modelin detay sayfasında
                  kaynak ve doğrulama tarihi belirtilmiştir.
                </p>
                <DataFreshness className="mt-3 text-xs text-text-faint" />
                {/* Düzeltme kanalı her sayfadan erişilebilir olmalı: hatayı
                    gören okuyucu Hakkında sayfasını aramak zorunda kalmasın. */}
                <a
                  href={REPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-text-muted underline-offset-4 hover:text-text hover:underline"
                >
                  Hatalı bir değer mi gördünüz? Bildirin ↗
                </a>
              </div>
              <div className="text-sm">
                <p className="font-medium text-text">Equinox ağı</p>
                <p className="mt-3 max-w-xs leading-relaxed text-text-muted">
                  Ana kapı Equinox&apos;ta; aile, ortak akış ve ajan profilleri
                  Orbit&apos;te.
                </p>
                <ul className="mt-3 space-y-1.5">
                  {networkLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                      >
                        {link.label}
                        <span className="ml-1.5 text-xs text-text-faint">
                          {link.host}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-start sm:justify-between">
              <p className="max-w-2xl text-xs leading-relaxed text-text-faint">
                Fiyatlar 1 milyon token başına ABD doları cinsindendir ve
                bilgilendirme amaçlıdır. Bağlayıcı fiyat için sağlayıcının
                kendi sayfasını esas alın.
              </p>
              <Link
                href="/hakkinda"
                className="shrink-0 text-xs text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
              >
                Hakkında
              </Link>
            </div>
          </div>
        </footer>

        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
