"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createMemo, getStudent } from "../../../../../lib/db";

export default function NewMemoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [studentName, setStudentName] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) getStudent(id).then((s) => setStudentName(s?.name ?? ""));
  }, [id]);

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setDateValue(`${y}-${m}-${d}`);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !text.trim()) return;
    setSaving(true);
    try {
      const date = dateValue ? new Date(dateValue + "T12:00:00").toISOString() : new Date().toISOString();
      await createMemo({ studentId: id, date, text: text.trim() });
      router.push(`/students/${id}?tab=memos`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="px-4 pt-6 pb-24">
      <header className="mb-6">
        <Link href={`/students/${id}`} className="inline-flex items-center gap-1 text-sm text-muted mb-2">
          ← {studentName || "生徒"}さんの詳細
        </Link>
        <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          メモを残す
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text mb-1">記入日</label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">メモ</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="自由にメモを残せます"
            rows={6}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft resize-none"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Link
            href={`/students/${id}`}
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-center text-sm text-muted"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={!text.trim() || saving}
            className="flex-1 rounded-2xl bg-primary text-white px-4 py-3 text-sm font-medium disabled:opacity-60"
          >
            {saving ? "保存中…" : "保存する"}
          </button>
        </div>
      </form>
    </main>
  );
}
