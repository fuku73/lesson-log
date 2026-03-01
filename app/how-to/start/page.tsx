"use client";

import Link from "next/link";

export default function HowToStartPage() {
  return (
    <main className="px-4 pt-6 pb-24">
      <header className="mb-6">
        <Link href="/how-to" className="inline-flex items-center gap-1 text-sm text-muted mb-2">
          ← How to
        </Link>
        <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          使い始める前に
        </h1>
        <p className="text-sm text-muted mt-2">
          レッスンログは、ブラウザで開いて「ホーム画面に追加」すると、アプリのように使えます。まずはこの設定をしてから使い始めましょう。
        </p>
      </header>

      <div className="space-y-6">
        <section className="bg-card rounded-2xl p-4 shadow-soft">
          <h2 className="text-base font-medium text-text mb-3 flex items-center gap-2">
            <img src="/phone-icon.png" alt="" className="w-6 h-6 object-contain" />
            iPhone（Safari）の場合
          </h2>
          <ol className="text-sm text-muted space-y-3 list-decimal list-inside">
            <li>
              <strong className="text-text">Safari</strong>（サファリ）でこのページを開く
              <p className="text-xs mt-1 ml-4">※ Chromeなど他のブラウザでは「ホームに追加」が出ないことがあります。Safariを使ってください。</p>
            </li>
            <li>
              画面の下にある<strong className="text-text">共有ボタン</strong>をタップ
              <p className="text-xs mt-1 ml-4">四角に上向き矢印のマークです。</p>
            </li>
            <li>
              メニューの中から<strong className="text-text">「ホーム画面に追加」</strong>をタップ
            </li>
            <li>
              名前を確認して<strong className="text-text">「追加」</strong>をタップ
            </li>
          </ol>
          <p className="text-xs text-muted mt-4 pt-3 border-t border-border">
            これでホーム画面にアイコンが表示されます。タップするだけでアプリのように開けます。
          </p>
        </section>

        <section className="bg-card rounded-2xl p-4 shadow-soft">
          <h2 className="text-base font-medium text-text mb-3 flex items-center gap-2">
            <img src="/phone-icon.png" alt="" className="w-6 h-6 object-contain" />
            Android（Chrome）の場合
          </h2>
          <ol className="text-sm text-muted space-y-3 list-decimal list-inside">
            <li>
              <strong className="text-text">Chrome</strong>（クローム）でこのページを開く
            </li>
            <li>
              画面右上の<strong className="text-text">⋮（縦3点）</strong>メニューをタップ
            </li>
            <li>
              メニューの中から<strong className="text-text">「アプリをインストール」</strong>または<strong className="text-text">「ホーム画面に追加」</strong>をタップ
              <p className="text-xs mt-1 ml-4">※ 機種やChromeのバージョンによって表示が少し違う場合があります。</p>
            </li>
            <li>
              確認画面で<strong className="text-text">「インストール」</strong>または<strong className="text-text">「追加」</strong>をタップ
            </li>
          </ol>
          <p className="text-xs text-muted mt-4 pt-3 border-t border-border">
            これでホーム画面にアイコンが表示されます。タップするだけでアプリのように開けます。
          </p>
        </section>

        <p className="text-sm text-muted">
          ホーム画面に追加すると、アプリのように画面いっぱいで使えて、操作もしやすくなります。
        </p>
      </div>
    </main>
  );
}
