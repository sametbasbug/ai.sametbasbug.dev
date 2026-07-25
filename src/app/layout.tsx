import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "Model Atlası — Yapay zekâ modellerini keşfedin ve karşılaştırın",
    template: "%s — Model Atlası",
  },
  description:
    "Claude, GPT, Gemini, Grok, Llama, Kumru ve daha fazlası. Yapay zekâ modellerini bağlam penceresi, fiyat ve yeteneklerine göre Türkçe olarak keşfedin ve yan yana karşılaştırın.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Model Atlası",
  },
};

const navLinks = [
  { href: "/", label: "Modeller" },
  { href: "/karsilastir", label: "Karşılaştır" },
  { href: "/saglayicilar", label: "Sağlayıcılar" },
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
            <Link href="/" className="group flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-md bg-accent font-mono text-sm font-bold text-accent-contrast"
              >
                MA
              </span>
              {/* Dar ekranda üç menü öğesiyle birlikte sığmıyor; MA işareti
                  ana sayfa bağlantısı olarak yeterli kalıyor. */}
              <span className="hidden whitespace-nowrap text-[15px] font-semibold tracking-tight min-[420px]:inline">
                Model Atlası
              </span>
              <span className="sr-only">Model Atlası ana sayfa</span>
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
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-sm">
                <p className="text-sm font-semibold">Model Atlası</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  Yapay zekâ modellerini Türkçe olarak keşfetmek ve
                  karşılaştırmak için bağımsız bir kaynak.
                </p>
              </div>
              <div className="text-sm text-text-muted">
                <p className="font-medium text-text">Veri hakkında</p>
                <p className="mt-2 max-w-xs leading-relaxed">
                  Fiyat ve teknik özellikler sağlayıcıların resmî
                  dokümantasyonundan derlenir. Her modelin detay sayfasında
                  kaynak ve doğrulama tarihi belirtilmiştir.
                </p>
              </div>
            </div>
            <p className="mt-8 border-t border-border pt-6 text-xs text-text-faint">
              Fiyatlar 1 milyon token başına ABD doları cinsindendir ve
              bilgilendirme amaçlıdır. Bağlayıcı fiyat için sağlayıcının kendi
              sayfasını esas alın.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
