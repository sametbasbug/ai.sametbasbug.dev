"use client";

import { useEffect, useState } from "react";

/**
 * Yeterince aşağı kaydırıldığında beliren "başa dön" düğmesi.
 *
 * Uzun katalog sayfalarında altbilgiye ulaşan okuyucunun başa dönmek için
 * ekranı baştan kaydırması gerekiyordu. Yapışkan başlık dar ekranda iki satır
 * olduğu için yukarı kaydırmak ayrıca sabırsızlık yaratıyor.
 *
 * Eşik bir ekran boyu: daha kısası düğmeyi neredeyse hep görünür yapar ve
 * içeriğin önünde durur.
 *
 * Kaydırma dinleyicisi `passive`, yani kaydırmayı bloklamaz. Değer yalnızca
 * eşiğin iki yanına geçerken durum güncellediği için yeniden çizim seyrek.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const toTop = () => {
    // Hareketi azaltma tercihi olan kullanıcıda yumuşak kaydırma baş
    // döndürebilir; globals.css'teki kural yalnızca CSS geçişlerini kapsıyor,
    // programatik kaydırmayı kapsamıyor.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    /*
     * z-30, karşılaştırma çubuğunun (z-40) altında kalsın diye bilinçli:
     * model seçiliyken sayfanın altını o çubuk kaplar ve kullanıcı zaten
     * karşılaştırma akışındadır. İkisini yan yana sıkıştırmak yerine düğme
     * o sırada görünmez.
     */
    <button
      type="button"
      onClick={toTop}
      className="fixed bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/95 text-text-muted shadow-sm backdrop-blur transition-colors hover:border-border-strong hover:text-text"
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
      </svg>
      <span className="sr-only">Sayfanın başına dön</span>
    </button>
  );
}
