"use client";

import Link from "next/link";

export default function HowToPage() {
  return (
    <main className="px-4 pt-6 pb-24">
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted mb-2">
          ← ホーム
        </Link>
        <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          How to
        </h1>
        <p className="text-sm text-muted mt-2">
          レッスンログの使い方ガイドです。
        </p>
      </header>

      <div className="space-y-3">
        <Link
          href="/how-to/start"
          className="block bg-card rounded-2xl p-4 shadow-soft border border-border/50 active:scale-[0.99] transition-transform"
        >
          <h2 className="text-base font-medium text-text flex items-center gap-2">
            <img src="/howto-icon.png" alt="" className="w-6 h-6 object-contain" />
            使い始める前に
          </h2>
          <p className="text-sm text-muted mt-1">
            ブラウザで開いて、ホーム画面に追加する方法（iPhone・Android）
          </p>
        </Link>

        <Link
          href="/how-to/transfer"
          className="block bg-card rounded-2xl p-4 shadow-soft border border-border/50 active:scale-[0.99] transition-transform"
        >
          <h2 className="text-base font-medium text-text flex items-center gap-2">
            <img src="/howto-icon.png" alt="" className="w-6 h-6 object-contain" />
            引き継ぎをする時
          </h2>
          <p className="text-sm text-muted mt-1">
            機種変えや別の端末で使うときのデータの移し方
          </p>
        </Link>
      </div>
    </main>
  );
}
