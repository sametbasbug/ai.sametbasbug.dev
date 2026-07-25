import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { EquinoxMark } from "@/components/EquinoxMark";
import {
  BLOG_URL,
  BRAND_NAME,
  BRAND_PREFIX,
  BRAND_PREFIX_UPPER,
  EQUINOX_URL,
  SITE_NAME,
} from "@/lib/brand";
import { SITE_URL } from "@/lib/constants";
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
  { href: "/saglayicilar", label: "Sağlayıcılar" },
];

/**
 * Altbilgideki ekosistem bağlantıları. Bilerek kısa: kardeş yüzeylerin güncel
 * listesi Equinox giriş sayfasında durur, burada çoğaltılırsa bir yüzey
 * kapandığında iki yerden birinin bayatlaması kaçınılmaz olur.
 */
const ecosystemLinks = [
  { href: EQUINOX_URL, label: "Equinox", host: "equinox.sametbasbug.dev" },
  { href: BLOG_URL, label: "Ana blog", host: "sametbasbug.dev" },
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
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
        >
          İçeriğe geç
        </a>

        <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <EquinoxMark className="h-9 w-9 shrink-0" />
              {/* Dar ekranda üç menü öğesiyle birlikte sığmıyor. `sr-only`
                  kullanılıyor, `hidden` değil: gizliyken de bağlantının
                  erişilebilir adı olarak kalıyor. */}
              <span className="sr-only whitespace-nowrap min-[420px]:not-sr-only">
                <span className="block font-mono text-[10px] font-semibold leading-none tracking-[0.18em] text-eq-gold-ink">
                  {BRAND_PREFIX_UPPER}
                </span>
                <span className="mt-1 block text-[15px] font-semibold leading-none tracking-tight">
                  {BRAND_NAME}
                </span>
              </span>
            </Link>

            <nav aria-label="Ana menü" className="ml-auto flex items-center gap-0.5 sm:gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-2 text-[13px] text-text-muted transition-colors hover:bg-surface-2 hover:text-text sm:px-3 sm:text-sm"
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

        <footer className="mt-20 border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="max-w-sm">
                <div className="flex items-center gap-2.5">
                  <EquinoxMark className="h-7 w-7 shrink-0" />
                  <p className="text-sm font-semibold">{SITE_NAME}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  Yapay zekâ modellerini Türkçe olarak keşfetmek ve
                  karşılaştırmak için bağımsız bir kaynak.
                </p>
              </div>
              <div className="text-sm text-text-muted">
                <p className="font-medium text-text">Veri hakkında</p>
                <p className="mt-3 max-w-xs leading-relaxed">
                  Fiyat ve teknik özellikler sağlayıcıların resmî
                  dokümantasyonundan derlenir. Her modelin detay sayfasında
                  kaynak ve doğrulama tarihi belirtilmiştir.
                </p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-text">Ekosistem</p>
                <p className="mt-3 max-w-xs leading-relaxed text-text-muted">
                  Model Atlası, Samet Başbuğ&apos;un Equinox ekosistemindeki
                  yayın yüzeylerinden biridir.
                </p>
                <ul className="mt-3 space-y-1.5">
                  {ecosystemLinks.map((link) => (
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
      </body>
    </html>
  );
}
