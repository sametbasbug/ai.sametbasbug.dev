"use client";

import { useSyncExternalStore } from "react";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/**
 * Açık/koyu tema düğmesi.
 *
 * Seçim `<html data-theme="...">` özniteliğinde tutulur ve `localStorage`'a
 * yazılır; CSS tarafındaki kural bu özniteliği okur. Öznitelik sayfa boyanmadan
 * önce `layout.tsx` içindeki satır içi betikle yerleşir — bu bileşen yalnızca
 * düğmenin kendisinden sorumludur.
 *
 * Etkin tema tarayıcıya ait bir durumdur (öznitelik + sistem tercihi), React
 * durumu değil. Bu yüzden `useState` + `useEffect` yerine
 * `useSyncExternalStore` kullanılıyor: sunucuda okunacak bir değer olmadığını
 * `getServerSnapshot` ile açıkça söylüyoruz, böylece hem hidrasyon uyuşmazlığı
 * hem de efekt içinde durum atama sorunu ortadan kalkıyor.
 */

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    query.removeEventListener("change", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  // Seçim yapılmamışsa sistem tercihi geçerlidir.
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Sunucuda etkin tema bilinemez — düğme ilk çizimde boş kalır. */
function getServerSnapshot(): null {
  return null;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Depolama kapalıysa (gizli sekme, katı gizlilik ayarı) seçim yalnızca
      // bu sayfa için geçerli olur. Tema yine de değişir — sessizce geçiyoruz.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  const isDark = theme === "dark";
  const label = isDark ? "Açık temaya geç" : "Koyu temaya geç";

  return (
    <button
      type="button"
      onClick={toggle}
      // Tema belirlenene kadar düğme boş bir kutu olarak durur; ölçüsü sabit
      // olduğu için menü ilk çizimden sonra kaymaz.
      aria-label={theme ? label : "Tema değiştir"}
      title={theme ? label : undefined}
      className="ml-1 grid h-8 w-8 shrink-0 place-items-center rounded-md text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
    >
      {theme ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          focusable="false"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isDark ? (
            // Güneş — tıklayınca aydınlığa geçilecek.
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
            </>
          ) : (
            // Ay — tıklayınca karanlığa geçilecek.
            <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" />
          )}
        </svg>
      ) : null}
    </button>
  );
}
