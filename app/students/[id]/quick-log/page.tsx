"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { createQuickLog, getStudent } from "../../../../lib/db";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function QuickLogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [talked, setTalked] = useState("");
  const [nextTime, setNextTime] = useState("");
  const [lessonAttended, setLessonAttended] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
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

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhotos((prev) => [...prev, dataUrl]);
    } catch (err) {
      console.error(err);
    }
    e.target.value = "";
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

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
          nextTime: nextTime.trim() || undefined,
          lessonAttended: lessonAttended.trim() || undefined,
          photos: photos.length > 0 ? photos : undefined
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
          レッスンの記録
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
          <label className="block text-sm font-medium text-text mb-1">参加したレッスン（自由記述）</label>
          <input
            type="text"
            value={lessonAttended}
            onChange={(e) => setLessonAttended(e.target.value)}
            placeholder="例：絵画、ピアノ"
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
          <label className="block text-sm font-medium text-text mb-2">作品の写真（写真をアップロード）</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <div className="flex flex-wrap gap-3">
            {photos.map((dataUrl, idx) => (
              <div key={idx} className="relative">
                <img
                  src={dataUrl}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                  aria-label="削除"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-2xl text-muted"
            >
              <FiPlus aria-hidden />
            </button>
          </div>
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
