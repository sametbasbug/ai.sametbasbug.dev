/**
 * Yapılandırılmış veriyi (JSON-LD) sayfaya gömer.
 *
 * `<` karakteri kaçırılıyor: veri içinde `</script>` geçen bir metin olsaydı
 * tarayıcı betiği orada kapatır ve kalan JSON sayfaya HTML olarak sızardı.
 * Veri şu an elle yazılan Türkçe metinlerden geliyor ve böyle bir dize
 * içermiyor, ama bu bileşenin güvenliği içeriğe bağlı olmamalı.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
