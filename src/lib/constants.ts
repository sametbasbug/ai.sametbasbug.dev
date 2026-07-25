/**
 * Aynı anda karşılaştırılabilecek azami model sayısı.
 *
 * Bu sabit bilerek istemci bileşenlerinin dışında tutulur: `"use client"`
 * işaretli bir modülden dışa aktarılan değer, sunucu bileşenine bir istemci
 * referansı olarak geçer (gerçek sayı yerine bir fonksiyon) ve sessizce yanlış
 * sonuç üretir.
 */
export const MAX_COMPARE = 4;

/**
 * Sitenin canlı adresi. Kanonik bağlantılar, Open Graph etiketleri, sitemap ve
 * robots.txt bu değerden üretilir — alan adı değişirse yalnızca burası değişir.
 */
export const SITE_URL = "https://ai.sametbasbug.dev";
