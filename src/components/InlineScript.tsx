/**
 * HTML ayrıştırılırken çalışan satır içi betik.
 *
 * Neden ayrı bir bileşen: React, istemcide çizim sırasında bir `<script>`
 * gördüğünde geliştirme kipinde uyarı veriyor — "bu betik istemcide zaten
 * çalışmaz" diyor. Uyarı doğru ve bizim için sorun da değil: betiğin yalnızca
 * ilk yüklemede, sayfa ayrıştırılırken çalışması *isteniyor*. Ama gerçek bir
 * sorunu gizleyebilecek bir gürültü olarak konsolda durmasının anlamı yok.
 *
 * Çözüm Next'in "preventing flash before hydration" rehberinden: betiğin türü
 * sunucuda `text/javascript`, istemcide `text/plain` olur. React yalnızca
 * çalıştırılabilir türdeki betikler için uyarıyor (`isScriptDataBlock`);
 * `text/plain` bir veri bloğu sayıldığı için uyarı çıkmıyor. Tarayıcı da
 * `text/plain` betiği çalıştırmaz — istemcide istediğimiz davranış zaten bu.
 *
 * `suppressHydrationWarning` tür farkı için gerekli: sunucudan gelen HTML
 * `text/javascript` diyor, istemci çizimi `text/plain` üretiyor.
 *
 * Not: `application/ld+json` de veri bloğu sayılır, bu yüzden JsonLd bileşeni
 * bu sarmalayıcıya ihtiyaç duymaz.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
