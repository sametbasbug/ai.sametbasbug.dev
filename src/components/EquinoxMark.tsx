/**
 * Equinox işareti — güneşin ay tarafından örtüldüğü an, altında iki yörünge
 * yayı. Ekinoks: gündüz ve gecenin eşitlendiği gün.
 *
 * Geometri equinox.sametbasbug.dev'deki işaretle aynıdır; ekosistem bağı
 * oradan gelir. Tek fark alttaki yayın rengi: hub'da menekşe, burada sitenin
 * kendi vurgu tonu. Böylece işaret sekmede hub'la karışmaz ama aileden
 * olduğu ilk bakışta okunur.
 *
 * Renkler bilinçli olarak sabit: bu bir marka işareti, tema değişkeni değil.
 * Gece zemini her iki temada da aynı kalır.
 *
 * Aynı geometri `app/icon.svg`, `app/apple-icon.tsx` ve
 * `app/opengraph-image.tsx` içinde de yer alır — biri değişirse hepsi
 * değişmeli. Marka işareti donmuş bir çizim olduğu için bu tekrar, üç ayrı
 * çıktı biçimini (DOM, favicon dosyası, satori) tek bir soyutlamaya zorlamaya
 * yeğlendi.
 */
export function EquinoxMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden
      focusable="false"
      className={className}
    >
      <rect width="64" height="64" rx="16" fill="#080914" />
      <circle cx="25" cy="32" r="15" fill="#f6c66a" opacity="0.95" />
      {/* Örten ay: zeminle aynı renkte, hilali oluşturan disk. */}
      <circle cx="39" cy="32" r="15" fill="#080914" />
      <path
        d="M11 34c12-12 30-12 42 0"
        fill="none"
        stroke="#73d7ff"
        strokeWidth="2"
        opacity="0.65"
      />
      <path
        d="M12 30c12 12 28 12 40 0"
        fill="none"
        stroke="#f2637a"
        strokeWidth="2"
        opacity="0.55"
      />
    </svg>
  );
}
