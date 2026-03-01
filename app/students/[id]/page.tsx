"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import {
  deleteStudent,
  getStudent,
  getQuickLogsByStudent,
  updateQuickLog,
  getMemosByStudent,
  updateMemo,
  deleteMemo
} from "../../../lib/db";
import type { Memo, QuickLog, Student } from "../../../lib/types";

type TabId = "basic" | "history" | "memos";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [logs, setLogs] = useState<QuickLog[]>([]);
  const [tab, setTab] = useState<TabId>("basic");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLog, setSelectedLog] = useState<QuickLog | null>(null);
  const [logEditMode, setLogEditMode] = useState(false);
  const [editTalked, setEditTalked] = useState("");
  const [editNextTime, setEditNextTime] = useState("");
  const [editLessonAttended, setEditLessonAttended] = useState("");
  const [editDateValue, setEditDateValue] = useState("");
  const [editPhotos, setEditPhotos] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const editPhotoInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const s = await getStudent(id);
    setStudent(s ?? null);
    if (s) {
      const [logList, memoList] = await Promise.all([
        getQuickLogsByStudent(s.id),
        getMemosByStudent(s.id)
      ]);
      setLogs(logList);
      setMemos(memoList);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (selectedLog) {
      setLogEditMode(false);
      setEditTalked(selectedLog.talked ?? "");
      setEditNextTime(selectedLog.nextTime ?? "");
      setEditLessonAttended(selectedLog.lessonAttended ?? "");
      setEditPhotos(selectedLog.photos ?? []);
      const d = new Date(selectedLog.date);
      setEditDateValue(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      );
    }
  }, [selectedLog]);

  useEffect(() => {
    if (searchParams.get("tab") === "memos") {
      setTab("memos");
      router.replace(`/students/${id}`);
    }
  }, [searchParams, id, router]);

  async function handleEditPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setEditPhotos((prev) => [...prev, dataUrl]);
    } catch (err) {
      console.error(err);
    }
    e.target.value = "";
  }

  async function handleSaveLog() {
    if (!selectedLog) return;
    setSaving(true);
    try {
      const date = editDateValue
        ? new Date(editDateValue + "T12:00:00").toISOString()
        : selectedLog.date;
      await updateQuickLog(selectedLog.id, {
        talked: editTalked.trim() || undefined,
        nextTime: editNextTime.trim() || undefined,
        lessonAttended: editLessonAttended.trim() || undefined,
        photos: editPhotos.length > 0 ? editPhotos : undefined,
        date
      });
      await load();
      setSelectedLog(null);
      setLogEditMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!student) return;
    setShowDeleteConfirm(false);
    await deleteStudent(student.id);
    router.push("/");
  }

  async function handleUpdateMemo(memoId: string, text: string, date: string) {
    setSaving(true);
    try {
      const isoDate = new Date(date + "T12:00:00").toISOString();
      await updateMemo(memoId, { text, date: isoDate });
      setEditingMemo(null);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMemo(memoId: string) {
    try {
      await deleteMemo(memoId);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  if (student === null) {
    return (
      <main className="px-4 pt-6 pb-24">
        <p className="text-muted">生徒さんが見つかりませんでした。</p>
        <Link href="/" className="text-primary text-sm mt-2 inline-block">← ホームに戻る</Link>
      </main>
    );
  }

  if (!student) {
    return (
      <main className="px-4 pt-6 pb-24">
        <p className="text-muted">読み込み中…</p>
      </main>
    );
  }

  const totalCount = logs.length;

  return (
    <main className="px-4 pt-6 pb-24">
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted">← ホーム</Link>
      </header>

      <div className="mb-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-sub flex items-center justify-center text-2xl text-muted overflow-hidden mb-3">
          {student.photo ? (
            <img src={student.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <span>{student.name.charAt(0)}</span>
          )}
        </div>
        <h1 className="text-xl font-semibold text-center" style={{ fontFamily: "var(--font-heading)" }}>
          {student.name}
        </h1>
        {student.nickname && <p className="text-sm text-muted">{student.nickname}</p>}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { id: "basic" as TabId, label: "基本情報" },
          { id: "history" as TabId, label: "レッスン履歴" },
          { id: "memos" as TabId, label: "なんでもメモ" }
        ].map(({ id: tid, label }) => (
          <button
            key={tid}
            onClick={() => setTab(tid)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
              tab === tid ? "bg-primary text-white" : "bg-sub text-muted hover:bg-border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-soft min-h-[120px]">
        {tab === "basic" && (
          <ul className="space-y-3 text-sm">
            <li><span className="text-muted">ニックネーム:</span> {student.nickname || "—"}</li>
            <li><span className="text-muted">居住地:</span> {student.location || "—"}</li>
            <li><span className="text-muted">好きな食べもの・飲みもの:</span> {student.favoriteDrink || "—"}</li>
            <li><span className="text-muted">家族/仕事:</span> {student.familyWork || "—"}</li>
            <li><span className="text-muted">アレルギー/注意事項:</span> {student.allergies || "—"}</li>
            <li><span className="text-muted">好きなこと、もの:</span> {student.favorites || "—"}</li>
            <li><span className="text-muted">参加しやすい曜日や時間帯:</span> {student.availableDays || "—"}</li>
            <li><span className="text-muted">好きな色やテイスト:</span> {student.favoriteStyle || "—"}</li>
            <li>
              <span className="text-muted">SNS顔出し:</span>{" "}
              {student.snsFaceOk === true ? "OK" : student.snsFaceOk === false ? "NG" : "—"}
            </li>
            {(student.tags ?? []).length > 0 && (
              <li><span className="text-muted">タグ:</span> {(student.tags ?? []).join(", ")}</li>
            )}
          </ul>
        )}
        {tab === "history" && (
          <ul className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-muted text-sm">まだレッスン記録がありません</p>
            ) : (
              logs.map((log, idx) => {
                const lessonNum = totalCount - idx;
                return (
                  <li key={log.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="w-full text-left text-sm border-b border-border pb-3 last:border-0 py-2 -my-2 px-2 -mx-2 rounded-xl hover:bg-sub/50 active:bg-sub transition-colors"
                    >
                      <span className="font-medium">{lessonNum}回目</span>
                      <span className="text-muted ml-2">
                        ・{" "}
                        {new Date(log.date).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                      {log.lessonAttended && (
                        <p className="text-muted mt-1 text-xs">参加: {log.lessonAttended}</p>
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        )}
        {tab === "memos" && (
          <div className="space-y-4">
            <Link
              href={`/students/${id}/memo/new`}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-white py-3 text-sm font-medium"
            >
              <FiPlus className="text-lg" aria-hidden />
              メモを残す
            </Link>
            <ul className="space-y-2">
              {memos.length === 0 ? (
                <p className="text-muted text-sm">まだメモがありません</p>
              ) : (
                memos.map((memo) => (
                  <li key={memo.id} className="border-b border-border pb-3 last:border-0">
                    {editingMemo?.id === memo.id ? (
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={editingMemo.date.slice(0, 10)}
                          onChange={(e) => setEditingMemo({ ...editingMemo, date: new Date(e.target.value + "T12:00:00").toISOString() })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                        />
                        <textarea
                          value={editingMemo.text}
                          onChange={(e) => setEditingMemo({ ...editingMemo, text: e.target.value })}
                          rows={3}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateMemo(editingMemo.id, editingMemo.text, editingMemo.date.slice(0, 10))}
                            disabled={saving}
                            className="flex-1 rounded-xl bg-primary text-white py-2 text-sm"
                          >
                            保存
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingMemo(null)}
                            className="flex-1 rounded-xl border border-border py-2 text-sm"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted">
                            {new Date(memo.date).toLocaleDateString("ja-JP", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </p>
                          <p className="text-sm whitespace-pre-wrap mt-1">{memo.text}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingMemo(memo)}
                            className="rounded-lg border border-border px-2 py-1 text-xs"
                          >
                            編集
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMemo(memo.id)}
                            className="rounded-lg border border-red-300 text-red-600 px-2 py-1 text-xs"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {tab === "basic" && (
          <Link
            href={`/students/${id}/edit`}
            className="block w-full text-center rounded-xl border border-primary bg-card px-4 py-3 text-sm font-medium text-primary"
          >
            編集
          </Link>
        )}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="block w-full text-center text-sm py-1"
          style={{ color: "#bb8686" }}
        >
          この生徒さんを削除する
        </button>
      </div>

      {selectedLog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50"
          onClick={() => { setSelectedLog(null); setLogEditMode(false); }}
        >
          <div
            className="bg-card rounded-t-2xl sm:rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!logEditMode ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">
                    {totalCount - logs.findIndex((l) => l.id === selectedLog.id)}回目
                  </h3>
                  <button
                    type="button"
                    onClick={() => { setSelectedLog(null); setLogEditMode(false); }}
                    className="text-muted text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-muted mb-4">
                  {new Date(selectedLog.date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
                {selectedLog.lessonAttended && (
                  <p className="text-sm mb-3">
                    <span className="text-muted">参加したレッスン:</span> {selectedLog.lessonAttended}
                  </p>
                )}
                {selectedLog.talked && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted mb-1">今日話したこと</p>
                    <p className="text-sm whitespace-pre-wrap">{selectedLog.talked}</p>
                  </div>
                )}
                {selectedLog.nextTime && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted mb-1">次回覚えておきたいこと</p>
                    <p className="text-sm whitespace-pre-wrap">{selectedLog.nextTime}</p>
                  </div>
                )}
                {(selectedLog.photos ?? []).length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted mb-2">作品の写真</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedLog.photos!.map((src, i) => (
                        <img key={i} src={src} alt="" className="w-24 h-24 rounded-xl object-cover" />
                      ))}
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setLogEditMode(true)}
                  className="w-full rounded-xl bg-primary text-white py-3 text-sm font-medium"
                >
                  編集する
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">
                    {totalCount - logs.findIndex((l) => l.id === selectedLog.id)}回目 の編集
                  </h3>
                  <button
                    type="button"
                    onClick={() => { setSelectedLog(null); setLogEditMode(false); }}
                    className="text-muted text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">日付</label>
                <input
                  type="date"
                  value={editDateValue}
                  onChange={(e) => setEditDateValue(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">参加したレッスン</label>
                <input
                  type="text"
                  value={editLessonAttended}
                  onChange={(e) => setEditLessonAttended(e.target.value)}
                  placeholder="例：絵画、ピアノ"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">今日話したこと</label>
                <textarea
                  value={editTalked}
                  onChange={(e) => setEditTalked(e.target.value)}
                  placeholder="話した内容や気づいたこと"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">次回覚えておきたいこと</label>
                <textarea
                  value={editNextTime}
                  onChange={(e) => setEditNextTime(e.target.value)}
                  placeholder="次回レッスンで忘れずに伝えたいこと"
                  rows={2}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-2">作品の写真</label>
                <input
                  ref={editPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEditPhotoChange}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  {editPhotos.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => setEditPhotos((p) => p.filter((_, j) => j !== i))}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => editPhotoInputRef.current?.click()}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-xl text-muted"
                  >
                    <FiPlus aria-hidden />
                  </button>
                </div>
              </div>
            </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setLogEditMode(false)}
                    className="flex-1 rounded-xl border border-border py-2.5 text-sm"
                  >
                    戻る
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveLog}
                    disabled={saving}
                    className="flex-1 rounded-xl bg-primary text-white py-2.5 text-sm font-medium disabled:opacity-60"
                  >
                    {saving ? "保存中…" : "保存する"}
                  </button>
                </div>
              </>
            )}
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
              「{student.name}」さんの情報を削除しますか？<br />
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
                className="flex-1 rounded-xl bg-red-600 text-white py-2 text-sm"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      <Link
        href={`/students/${id}/quick-log`}
        className="fixed right-4 md:right-6 inline-flex items-center gap-2 pl-5 pr-4 py-3 rounded-full bg-primary text-white shadow-soft active:scale-95 transition-transform text-sm font-medium min-h-[48px]"
        style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        aria-label="レッスンの記録を追加"
      >
        <FiPlus className="text-xl" aria-hidden />
        <span>レッスンの記録を追加</span>
      </Link>
    </main>
  );
}
