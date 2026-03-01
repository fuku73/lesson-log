"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createLessonLog } from "../../../lib/db";

export default function NewDiaryPage() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [attendees, setAttendees] = useState("");
  const [revenue, setRevenue] = useState("");
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setDate(`${y}-${m}-${d}`);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date.trim() || !content.trim() || !attendees.trim()) return;
    setSaving(true);
    try {
      const log = await createLessonLog({
        date: date.trim(),
        content: content.trim(),
        attendees: attendees.trim(),
        revenue: revenue ? parseInt(revenue, 10) : undefined,
        memo: memo.trim() || undefined
      });
      router.push(`/diary/${log.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="px-4 pt-6 pb-24">
      <header className="mb-6">
        <Link href="/diary" className="inline-flex items-center gap-1 text-sm text-muted mb-2">
          ← レッスン日誌
        </Link>
        <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          新しい日誌を追加
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text mb-2">日付 <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">レッスン内容 <span className="text-red-500">*</span></label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="例：ピアノレッスン、絵画教室"
            required
            rows={3}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">来た人 <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder="例：こはるさん、たろうくん（複数人は「、」で区切り）"
            required
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">売上（任意）</label>
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            placeholder="例：3000"
            min={0}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">メモ（任意）</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="自由にメモ"
            rows={2}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft resize-none"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Link href="/diary" className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-center text-sm text-muted">
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-2xl bg-primary text-white px-4 py-3 text-sm font-medium disabled:opacity-60"
          >
            {saving ? "保存中…" : "保存する"}
          </button>
        </div>
      </form>
    </main>
  );
}
