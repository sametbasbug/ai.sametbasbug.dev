"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { models } from "@/data/models";
import { providerMap } from "@/data/providers";
import type { Model } from "@/data/types";
import { formatContext, formatCost, formatPrice } from "@/lib/format";
import { estimateCost, type Usage } from "@/lib/pricing";

/**
 * Tipik iş yükleri. Kullanıcı sıfırdan sayı uydurmak zorunda kalmasın diye
 * var: hesaplayıcının ilk faydası "benimkine en yakın olan hangisi" sorusuna
 * tek tıkla cevap verebilmek.
 */
const presets: { label: string; hint: string; usage: Omit<Usage, "cachedRatio"> }[] =
  [
    {
      label: "Sohbet asistanı",
      hint: "Kısa istem, kısa yanıt, çok istek",
      usage: { inputTokens: 2_000, outputTokens: 500, requests: 50_000 },
    },
    {
      label: "Belge özetleme",
      hint: "Uzun istem, kısa yanıt",
      usage: { inputTokens: 60_000, outputTokens: 1_500, requests: 2_000 },
    },
    {
      label: "Kod ajanı",
      hint: "Çok uzun bağlam, uzun yanıt",
      usage: { inputTokens: 250_000, outputTokens: 8_000, requests: 500 },
    },
  ];

/**
 * Hidrasyondan sonra `true`. Tanıtım fiyatlarının bugünün takvimine göre
 * uygulanabilmesi için gerekli: site statik olarak dışa aktarıldığından
 * sunucu tarafındaki "bugün" derleme günüdür ve sayfa açıldığında çoktan
 * eskimiş olabilir. `useSyncExternalStore`, hidrasyon sırasında sunucu
 * anlık görüntüsünü kullandığı için uyuşmazlık uyarısı üretmeden ayrışabiliriz.
 */
const noopSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * Hidrasyondan önceki tek karelik render'da ve JavaScript kapalıyken
 * kullanılan gün. Bilerek uzak gelecekte: süreli tanıtım fiyatları devre dışı
 * kalır, yani ilk çizimde her zaman bağlayıcı olan liste fiyatı görünür.
 */
const NO_PROMO_DAY = new Date("9999-12-31");

type Row = {
  model: Model;
  cost: ReturnType<typeof estimateCost>;
};

export function CostCalculator() {
  const [usage, setUsage] = useState<Usage>({
    ...presets[0].usage,
    cachedRatio: 0,
  });

  const hydrated = useSyncExternalStore(noopSubscribe, onClient, onServer);
  const today = hydrated ? new Date() : NO_PROMO_DAY;
  const todayKey = hydrated ? today.toDateString() : "sabit";

  const { rows, openWeight } = useMemo(() => {
    const priced: Row[] = [];
    const free: Model[] = [];

    for (const model of models) {
      if (model.pricing === null) {
        free.push(model);
        continue;
      }
      priced.push({ model, cost: estimateCost(model.pricing, usage, today) });
    }

    priced.sort((a, b) => a.cost.total - b.cost.total);
    return { rows: priced, openWeight: free };
    // `today` her render'da yeni bir nesne; bağımlılık olarak gün anahtarını
    // kullanıyoruz, yoksa memo hiçbir zaman tutmaz.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usage, todayKey]);

  const cheapest = rows[0]?.cost.total ?? 0;
  const anyCacheIgnored = rows.some((row) => row.cost.cacheIgnored);
  const anyCacheAssumed = rows.some((row) => row.cost.rates.cachedInputAssumed);

  const set = (key: keyof Usage) => (value: number) =>
    setUsage((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------- iş yükü */}
      <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-faint">
          İş yükünüz
        </h2>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() =>
                setUsage((current) => ({
                  ...preset.usage,
                  cachedRatio: current.cachedRatio,
                }))
              }
              className="rounded-lg border border-border px-3 py-2 text-left transition-colors hover:border-border-strong"
            >
              <span className="block text-sm font-medium">{preset.label}</span>
              <span className="mt-0.5 block text-xs text-text-faint">
                {preset.hint}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <NumberField
            id="girdi"
            label="İstek başına girdi"
            unit="token"
            value={usage.inputTokens}
            onChange={set("inputTokens")}
            step={1_000}
          />
          <NumberField
            id="cikti"
            label="İstek başına çıktı"
            unit="token"
            value={usage.outputTokens}
            onChange={set("outputTokens")}
            step={500}
          />
          <NumberField
            id="istek"
            label="Aylık istek sayısı"
            unit="istek"
            value={usage.requests}
            onChange={set("requests")}
            step={1_000}
          />
        </div>

        <div className="mt-6">
          <label htmlFor="onbellek" className="text-sm font-medium">
            Girdinin önbellekten gelen oranı
            <span className="ml-2 tabular-nums text-text-muted">
              %{Math.round(usage.cachedRatio * 100)}
            </span>
          </label>
          <input
            id="onbellek"
            type="range"
            min={0}
            max={100}
            step={5}
            value={Math.round(usage.cachedRatio * 100)}
            onChange={(event) =>
              set("cachedRatio")(Number(event.target.value) / 100)
            }
            className="mt-2 w-full accent-accent"
          />
          <p className="mt-1.5 text-xs leading-relaxed text-text-faint">
            Aynı sistem istemini tekrar tekrar gönderen uygulamalarda girdinin
            büyük kısmı önbellekten okunur. Önbellek fiyatı açıklamayan
            modellerde bu oran yok sayılır.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- sonuç */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-faint">
          Aylık maliyet
        </h2>

        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[620px] border-collapse bg-surface text-sm">
            <caption className="sr-only">
              Girilen kullanıma göre modellerin aylık maliyeti, ucuzdan pahalıya
            </caption>
            <thead>
              <tr className="border-b border-border bg-surface-2 text-xs uppercase tracking-wide text-text-faint">
                <th scope="col" className="px-4 py-2.5 text-left font-medium">
                  Model
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Girdi
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Çıktı
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Toplam
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  En ucuza göre
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ model, cost }) => (
                <tr key={model.slug} className="border-t border-border">
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <span className="flex items-center gap-1.5 text-xs text-text-muted">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: providerMap[model.providerId].accent,
                        }}
                      />
                      {providerMap[model.providerId].name}
                    </span>
                    <Link
                      href={`/modeller/${model.slug}`}
                      className="mt-0.5 block font-medium underline-offset-4 hover:underline"
                    >
                      {model.name}
                    </Link>
                    <span className="mt-0.5 block text-xs tabular-nums text-text-faint">
                      {formatPrice(cost.rates.input)} /{" "}
                      {formatPrice(cost.rates.output)}
                      {cost.rates.tier ? " · uzun bağlam kademesi" : ""}
                      {cost.rates.promoApplied ? " · tanıtım fiyatı" : ""}
                    </span>
                  </th>
                  <td className="px-4 py-3 text-right tabular-nums text-text-muted">
                    {formatCost(cost.inputCost)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text-muted">
                    {formatCost(cost.outputCost)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {formatCost(cost.total)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text-faint">
                    {cheapest > 0
                      ? `${(cost.total / cheapest).toLocaleString("tr-TR", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}×`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-4 space-y-1.5 text-xs leading-relaxed text-text-faint">
          <li>
            Kademeli fiyatlandırmada eşiği aşan istekler bütünüyle üst kademeden
            hesaplanır — tabloda hangi modelde hangi kademenin devrede olduğu
            model adının altında yazar.
          </li>
          {anyCacheIgnored ? (
            <li>
              Önbellek fiyatı açıklamayan modellerde girdinin tamamı tam
              fiyattan hesaplandı.
            </li>
          ) : null}
          {anyCacheAssumed ? (
            <li>
              Üst kademede önbellek fiyatının nasıl değiştiği sağlayıcı
              tarafından açıklanmadığı için taban önbellek fiyatı kullanıldı;
              gerçek tutar bundan yüksek olabilir.
            </li>
          ) : null}
          <li>
            Sonuçlar yalnızca token ücretini kapsar. Toplu işlem indirimi, ücretsiz
            kota, görsel veya ses girdisi ve sağlayıcıya özgü ek kalemler hesaba
            katılmaz.
          </li>
        </ul>
      </section>

      {/* -------------------------------------------------- açık ağırlık */}
      {openWeight.length > 0 ? (
        <section className="rounded-xl border border-open/20 bg-open-soft p-5">
          <h2 className="text-sm font-semibold text-open">
            Token ücreti olmayan modeller
          </h2>
          {/* "Açık ağırlıklı model sayısı" burada bilerek kullanılmıyor:
              katalogda ağırlıkları açık olup ücretli bir API'si de olan
              modeller var (Mistral). Tablonun dışında kalanlar açık ağırlıklı
              olanlar değil, token ücreti hiç olmayanlardır. */}
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Aşağıdaki {openWeight.length} modelin token ücreti yoktur:
            ağırlıklarını indirip kendi donanımınızda çalıştırırsınız. Maliyet
            donanıma ve kullanım yoğunluğuna bağlı olduğu için tabloya girmez.
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
            {openWeight.map((model) => (
              <li key={model.slug}>
                <Link
                  href={`/modeller/${model.slug}`}
                  className="text-text-muted underline-offset-4 hover:text-text hover:underline"
                >
                  {model.name}
                </Link>
                <span className="ml-1.5 text-xs tabular-nums text-text-faint">
                  {formatContext(model.contextWindow)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function NumberField({
  id,
  label,
  unit,
  value,
  onChange,
  step,
}: {
  id: string;
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  step: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          step={step}
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value);
            // Boş alan `NaN` üretir; negatif değer maliyeti eksiye çevirir.
            onChange(Number.isFinite(next) && next >= 0 ? next : 0);
          }}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm tabular-nums focus:border-accent focus:outline-none"
        />
        <span className="shrink-0 text-xs text-text-faint">{unit}</span>
      </div>
    </div>
  );
}
