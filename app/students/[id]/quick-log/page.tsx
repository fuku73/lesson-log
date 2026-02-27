"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createQuickLog, getStudent } from "../../../../lib/db";
import type { Mood } from "../../../../lib/types";

const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: "good", label: "元気" },
  { value: "normal", label: "普通" },
  { value: "tired", label: "少し疲れ気味" },
  { value: "excited", label: "テンション高め" },
  { value: "other", label: "その他" }
];

export default function QuickLogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [talked, setTalked] = useState("");
  const [mood, setMood] = useState<Mood | "">("");
  const [nextTime, setNextTime] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [studentName, setStudentName] = useState("");

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
    if (!id) return;
    setSaving(true);
    try {
      const date = dateValue ? new Date(dateValue + "T12:00:00").toISOString() : undefined;
      await createQuickLog(
        {
          studentId: id,
          talked: talked.trim() || undefined,
          mood: mood || undefined,
          nextTime: nextTime.trim() || undefined,
          tags: tagsInput.split(/[,\s]+/).map((t) => t.trim()).filter(Boolean)
        },
        date
      );
      router.push(`/students/${id}`);
    } catch (err) {
      console.error(err);
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
          3分で記録
        </h1>
        <p className="text-sm text-muted mt-1">今日のレッスンをサッとメモしましょう</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text mb-1">日付</label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">今日話したこと</label>
          <textarea
            value={talked}
            onChange={(e) => setTalked(e.target.value)}
            placeholder="話した内容や気づいたことをメモ"
            rows={4}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">今日の様子</label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map(({ value, label }) => (
              <label
                key={value}
                className={`px-4 py-2 rounded-xl text-sm cursor-pointer transition-colors ${
                  mood === value ? "bg-primary text-white" : "bg-sub text-muted hover:bg-border"
                }`}
              >
                <input
                  type="radio"
                  name="mood"
                  value={value}
                  checked={mood === value}
                  onChange={() => setMood(value)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">次回覚えておきたいこと</label>
          <textarea
            value={nextTime}
            onChange={(e) => setNextTime(e.target.value)}
            placeholder="次回レッスンで忘れずに伝えたいこと"
            rows={2}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">タグ（カンマやスペース区切り）</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="例：算数, 集中できた"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Link href={`/students/${id}`} className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-center text-sm text-muted">
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
