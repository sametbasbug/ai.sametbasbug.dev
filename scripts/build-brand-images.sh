#!/usr/bin/env bash
#
# Marka görsellerini (OG görseli ve Apple simgesi) yeniden üretir.
#
# Neden bir betik gerekiyor: `tools/brand/` altındaki üreteçler `src/app/`
# içinde dursaydı Next onları her derlemede uzantısız birer rota olarak
# üretirdi (`out/opengraph-image`). GitHub Pages içerik tipini dosya
# uzantısından belirlediği için bu dosyalar `application/octet-stream` olarak
# sunulur ve paylaşım önizlemelerinde görsel olarak kabul edilmez.
#
# Bu yüzden üreteçler geçici olarak `src/app/` altına kopyalanır, bir derleme
# alınır, çıkan PNG'ler depoya statik dosya olarak yazılır ve üreteçler geri
# kaldırılır. Sonuçta `out/opengraph-image.png` doğru uzantı ve içerik tipiyle
# yayına çıkar.
#
# Yalnızca marka işareti veya görsel düzeni değiştiğinde çalıştırın; normal
# derleme akışının parçası değildir.
#
# Kullanım:  ./scripts/build-brand-images.sh

set -euo pipefail

cd "$(dirname "$0")/.."

generated=(src/app/opengraph-image.tsx src/app/apple-icon.tsx)

# Üreteçler her koşulda temizlensin — derleme yarıda kalsa bile `src/app/`
# altında rota üreten bir dosya kalmamalı.
cleanup() {
  rm -f "${generated[@]}"
}
trap cleanup EXIT

# Aynı adı taşıyan statik PNG ile üreteç yan yana duramaz.
rm -f src/app/opengraph-image.png src/app/apple-icon.png

cp tools/brand/opengraph-image.tsx tools/brand/apple-icon.tsx src/app/

npm run build

cp out/opengraph-image src/app/opengraph-image.png
cp out/apple-icon src/app/apple-icon.png

echo
echo "Üretildi:"
echo "  src/app/opengraph-image.png"
echo "  src/app/apple-icon.png"
echo
echo "Bunları depoya işleyin, ardından 'npm run build' ile son çıktıyı alın."
