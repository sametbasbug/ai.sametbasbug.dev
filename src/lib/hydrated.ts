"use client";

import { useSyncExternalStore } from "react";

/**
 * Sunucuda `false`, hidrasyondan sonra `true` döner.
 *
 * Kullanım amacı: sunucu çıktısıyla istemci çıktısının bilerek ayrıştığı
 * yerlerde ayrışmayı React'e düzgün bildirmek. `useState` + `useEffect` ile
 * de yazılabilirdi ama `useSyncExternalStore` ilk boyamada doğru değeri
 * verdiği için arada bir kare boyunca yanlış içerik görünmez.
 *
 * Abonelik boş: değer hidrasyondan sonra bir daha değişmez.
 */
const noopSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, onClient, onServer);
}
