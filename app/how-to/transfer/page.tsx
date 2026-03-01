"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { exportAllData, downloadBackup, importAllData } from "../../../lib/backup";

export default function HowToTransferPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleExport() {
    setExporting(true);
    setMessage(null);
    try {
      const blob = await exportAllData();
      downloadBackup(blob);
      setMessage({ type: "ok", text: "バックアップファイルをダウンロードしました。" });
    } catch (e) {
      console.error(e);
      setMessage({ type: "err", text: "エクスポートに失敗しました。" });
    } finally {
      setExporting(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setMessage(null);
    try {
      const result = await importAllData(file);
      setMessage({ type: result.ok ? "ok" : "err", text: result.message });
      if (result.ok) {
        setTimeout(() => router.push("/students"), 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "err", text: "インポートに失敗しました。" });
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  return (
    <main className="px-4 pt-6 pb-24">
      <header className="mb-6">
        <Link href="/how-to" className="inline-flex items-center gap-1 text-sm text-muted mb-2">
          ← How to
        </Link>
        <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          引き継ぎをする時
        </h1>
        <p className="text-sm text-muted mt-2">
          スマホを買い替えたり、別の端末で使いたいときに、データを持ち運ぶためのページです。
        </p>
      </header>

      <div className="mb-6 p-4 rounded-2xl bg-sub/50 border border-border/50">
        <h2 className="text-sm font-medium text-text mb-2">📱 機種変え・引き継ぎの流れ</h2>
        <ol className="text-sm text-muted space-y-2 list-decimal list-inside">
          <li><strong className="text-text">今使っているスマホ</strong>で「データを書き出す」を押す</li>
          <li>ダウンロードされたファイルを、iCloudやGoogleドライブなど<strong className="text-text">安全な場所に保存</strong>する</li>
          <li><strong className="text-text">新しいスマホ</strong>でこのアプリを開く</li>
          <li>「ファイルを選んで読み込む」を押し、保存しておいたファイルを選ぶ</li>
        </ol>
        <p className="text-xs text-muted mt-3">
          ※ データはこのスマホの中だけに保存されています。書き出しておかないと、機種変えで消えてしまいます。
        </p>
      </div>

      <div className="space-y-4">
        <section className="bg-card rounded-2xl p-4 shadow-soft">
          <h2 className="text-sm font-medium text-text mb-2 flex items-center gap-2">
            <img src="/export-icon.png" alt="" className="w-5 h-5 object-contain" />
            データを書き出す
          </h2>
          <p className="text-sm text-muted mb-2">
            今のスマホに入っている生徒さん情報とレッスン記録を、1つのファイルにまとめて保存します。
          </p>
          <p className="text-xs text-muted mb-3">
            機種変えの<strong>前</strong>に必ず実行してください。ダウンロードされたファイル（.json）を、写真や書類と同じようにiCloud・Googleドライブ・パソコンなどにコピーしておくと安心です。
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full rounded-xl bg-primary text-white py-3 text-sm font-medium disabled:opacity-60"
          >
            {exporting ? "書き出し中…" : "データを書き出す"}
          </button>
        </section>

        <section className="bg-card rounded-2xl p-4 shadow-soft">
          <h2 className="text-sm font-medium text-text mb-2 flex items-center gap-2">
            <img src="/import-icon.png" alt="" className="w-5 h-5 object-contain" />
            データを読み込む
          </h2>
          <p className="text-sm text-muted mb-2">
            以前「書き出し」で保存したファイルを選ぶと、そのデータがこのスマホに復元されます。
          </p>
          <p className="text-xs text-muted mb-3">
            <strong>注意：</strong>読み込むと、今このスマホに入っているデータは<strong>すべて上書き</strong>されます。新しいスマホで初めて使うとき、または「以前のデータに戻したい」ときに使ってください。
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="w-full rounded-xl border border-primary text-primary py-3 text-sm font-medium disabled:opacity-60"
          >
            {importing ? "読み込み中…" : "ファイルを選んで読み込む"}
          </button>
        </section>

        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              message.type === "ok" ? "bg-primary/20 text-primary" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </main>
  );
}
