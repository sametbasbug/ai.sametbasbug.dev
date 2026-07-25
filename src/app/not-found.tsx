import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-24 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Bu sayfa bulunamadı
      </h1>
      <p className="mt-3 leading-relaxed text-text-muted">
        Aradığınız model kaldırılmış veya adresi değişmiş olabilir. Tüm
        modellere listeden ulaşabilirsiniz.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent-hover"
      >
        Model listesine dön
      </Link>
    </div>
  );
}
