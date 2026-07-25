import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages yalnızca statik dosya sunar; tüm site derleme sırasında
  // HTML'e dökülür. Sunucu tarafı özellik kullanılmadığı için kayıp yok.
  output: "export",

  // Her rota `dizin/index.html` olarak üretilir. Statik barındırmada uzantısız
  // adreslerin (`/modeller/kumru-7b`) sorunsuz çözülmesini garanti eder.
  trailingSlash: true,
};

export default nextConfig;
