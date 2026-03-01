"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="px-4 pt-6 pb-24 bg-background min-h-screen flex flex-col items-center justify-center">
      <header className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="" className="w-20 h-20 object-contain drop-shadow-sm" />
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-heading)", color: "#4A4A4A" }}
        >
          レッスンログ
        </h1>
        <p className="text-sm text-muted mt-2">
          レッスン記録をまとめるノート
        </p>
        <Link
          href="/how-to"
          className="inline-flex items-center gap-2 mt-4 py-2.5 px-4 rounded-2xl bg-sub/80 hover:bg-primary/20 transition-colors"
          style={{ color: "#C4A99E", textDecoration: "none" }}
        >
          <img src="/howto-icon.png" alt="" className="w-4 h-4 object-contain" />
          <span className="text-sm font-medium">How to</span>
        </Link>
      </header>

      <div className="w-full max-w-sm space-y-5">
        <Link
          href="/diary"
          className="block rounded-2xl p-6 shadow-soft border-2 active:scale-[0.98] transition-transform text-center overflow-hidden"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E8D5D2",
            boxShadow: "0 4px 20px rgba(221, 199, 196, 0.25)"
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(221, 199, 196, 0.35)" }}>
            <img src="/diary-icon.png" alt="" className="w-8 h-8 object-contain" />
          </div>
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "#4A4A4A" }}>
            レッスン日誌
          </h2>
          <p className="text-sm mt-1" style={{ color: "#9B9B9B" }}>
            日ごとのレッスン記録をつける
          </p>
        </Link>

        <Link
          href="/students"
          className="block rounded-2xl p-6 shadow-soft border-2 active:scale-[0.98] transition-transform text-center overflow-hidden"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E8D5D2",
            boxShadow: "0 4px 20px rgba(221, 199, 196, 0.25)"
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(221, 199, 196, 0.35)" }}>
            <img src="/student-icon.png" alt="" className="w-8 h-8 object-contain" />
          </div>
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "#4A4A4A" }}>
            生徒さんノート
          </h2>
          <p className="text-sm mt-1" style={{ color: "#9B9B9B" }}>
            生徒ごとの情報とレッスン履歴
          </p>
        </Link>
      </div>
    </main>
  );
}
