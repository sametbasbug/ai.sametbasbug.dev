"use client";

import { formatDate } from "@/lib/format";
import { daysSince, OLDEST_VERIFIED, STALE_AFTER_DAYS } from "@/lib/freshness";
import { useHydrated } from "@/lib/hydrated";

/**
 * Verinin kaç günlük olduğunu gösterir.
 *
 * Neden istemci bileşeni: site statik olarak dışa aktarılıyor, yani sunucu
 * tarafındaki "bugün" derleme günüdür. Yaşı orada hesaplasaydık, site
 * yayınlandıktan sonra dokunulmadığı sürece rakam donar ve altı aylık veri
 * ilelebet "1 gün önce doğrulandı" derdi — yani tam olarak gizlemek istediğimiz
 * şeyi gizlerdi.
 *
 * Tarihin kendisi sunucuda çiziliyor: JavaScript çalışmasa da okuyucu verinin
 * hangi güne ait olduğunu görür. Göreli yaş hidrasyondan sonra ekleniyor.
 */

/** "1 gün önce", "dün", "bugün". */
function relativeAge(days: number): string {
  if (days === 0) return "bugün";
  if (days === 1) return "dün";
  return `${days} gün önce`;
}

export function DataFreshness({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const days = hydrated ? daysSince(OLDEST_VERIFIED, new Date()) : null;
  const stale = days !== null && days > STALE_AFTER_DAYS;

  return (
    <p className={className}>
      {/* Tarihe Türkçe ek getirmiyoruz: "2026'da" doğru ama "2025'te" farklı
          ekle yazılır ve yıl değiştiğinde metin sessizce bozulur. */}
      <span>Son doğrulama: {formatDate(OLDEST_VERIFIED)}</span>
      {days !== null ? (
        <>
          <span aria-hidden> · </span>
          <span className={stale ? "font-medium text-accent" : undefined}>
            {relativeAge(days)}
            {stale ? " · tazelenmeli" : ""}
          </span>
        </>
      ) : null}
    </p>
  );
}
