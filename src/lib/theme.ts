export type Theme = "light" | "dark";

/** Kullanıcının tema seçiminin `localStorage`'daki anahtarı. */
export const THEME_STORAGE_KEY = "tema";

/**
 * Tema değiştiğinde pencerede tetiklenen olay.
 *
 * `data-theme` özniteliğini değiştirmek kendiliğinden bir olay üretmez, bu
 * yüzden düğmenin kendi güncellemesini duyabilmesi için açık bir sinyal
 * gerekiyor.
 */
export const THEME_CHANGE_EVENT = "tema-degisti";

/**
 * Sayfa boyanmadan önce çalışan betik.
 *
 * Neden gerekli: site statik HTML olarak sunulur ve sunucu, ziyaretçinin daha
 * önce hangi temayı seçtiğini bilemez. Bu betik olmasaydı koyu tema seçmiş bir
 * kullanıcı her sayfa açılışında önce açık temayı görür, sonra ekran koyuya
 * dönerdi. Betik `<body>`nin ilk çocuğu olarak, eş zamanlı çalışır: ayrıştırma
 * bu satırda durur, öznitelik yerleşir, ardından içerik çizilir.
 *
 * `try/catch` gerekli: bazı gizlilik ayarlarında `localStorage` erişimi
 * doğrudan hata fırlatır. O durumda sistem tercihi geçerli kalmalı, sayfa
 * çökmemeli.
 *
 * Dize olarak tutuluyor çünkü satır içi betik olarak gömülüyor — buradaki kod
 * derlenmez, olduğu gibi HTML'e yazılır. Bu yüzden sade ve bağımlılıksız.
 */
export const themeInitScript = `
try {
  var t = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch (e) {}
`.trim();
