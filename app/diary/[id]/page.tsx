"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getLessonLog, updateLessonLog, deleteLessonLog } from "../../../lib/db";
import type { LessonLog } from "../../../lib/types";

function formatDateForDisplay(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export default function DiaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [log, setLog] = useState<LessonLog | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [attendees, setAttendees] = useState("");
  const [revenue, setRevenue] = useState("");
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const l = await getLessonLog(id);
    setLog(l ?? null);
    if (l) {
      setDate(l.date);
      setContent(l.content);
      setAttendees(l.attendees);
      setRevenue(l.revenue != null ? String(l.revenue) : "");
      setMemo(l.memo ?? "");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    if (!log) return;
    setSaving(true);
    try {
      await updateLessonLog(id, {
        date,
        content,
        attendees,
        revenue: revenue ? parseInt(revenue, 10) : undefined,
        memo: memo.trim() || undefined
      });
      await load();
      setEditMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!log) return;
    setShowDeleteConfirm(false);
    await deleteLessonLog(id);
    router.push("/diary");
  }

  if (log === null) {
    return (
      <main className="px-4 pt-6 pb-24">
        <p className="text-muted">日誌が見つかりませんでした。</p>
        <Link href="/diary" className="text-primary text-sm mt-2 inline-block">← レッスン日誌に戻る</Link>
      </main>
    );
  }

  if (!log) {
    return (
      <main className="px-4 pt-6 pb-24">
        <p className="text-muted">読み込み中…</p>
      </main>
    );
  }

  return (
    <main className="px-4 pt-6 pb-24">
      <header className="mb-6">
        <Link href="/diary" className="inline-flex items-center gap-1 text-sm text-muted mb-2">
          ← レッスン日誌
        </Link>
      </header>

      {!editMode ? (
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 space-y-4">
          <p className="text-sm text-muted">{formatDateForDisplay(log.date)}</p>
          <div>
            <p className="text-xs text-muted mb-1">レッスン内容</p>
            <p className="text-sm whitespace-pre-wrap">{log.content}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">来た人</p>
            <p className="text-sm">{log.attendees}</p>
          </div>
          {log.revenue != null && (
            <div>
              <p className="text-xs text-muted mb-1">売上</p>
              <p className="text-sm">¥{log.revenue.toLocaleString()}</p>
            </div>
          )}
          {log.memo && (
            <div>
              <p className="text-xs text-muted mb-1">メモ</p>
              <p className="text-sm whitespace-pre-wrap">{log.memo}</p>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setEditMode(true)}
              className="flex-1 rounded-xl bg-primary text-white py-3 text-sm font-medium"
            >
              編集する
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 rounded-xl border border-border py-3 text-sm"
              style={{ color: "#bb8686" }}
            >
              削除する
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 space-y-5">
          <div>
            <label className="block text-sm font-medium text-text mb-2">日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">レッスン内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">来た人</label>
            <input
              type="text"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">売上（任意）</label>
            <input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              min={0}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">メモ（任意）</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 rounded-xl border border-border py-3 text-sm"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !content.trim() || !attendees.trim()}
              className="flex-1 rounded-xl bg-primary text-white py-3 text-sm font-medium disabled:opacity-60"
            >
              {saving ? "保存中…" : "保存する"}
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-text mb-4">
              {formatDateForDisplay(log.date)}の日誌を削除しますか？<br />
              削除すると元に戻せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-border py-2 text-sm"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl text-white py-2 text-sm"
                style={{ backgroundColor: "#bb8686" }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
