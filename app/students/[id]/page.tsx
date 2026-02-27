"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  deleteStudent,
  getStudent,
  getLatestQuickLog,
  getQuickLogsByStudent
} from "../../../lib/db";
import type { QuickLog, Student } from "../../../lib/types";

type TabId = "basic" | "history" | "memo";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [latestLog, setLatestLog] = useState<QuickLog | null | undefined>(undefined);
  const [logs, setLogs] = useState<QuickLog[]>([]);
  const [tab, setTab] = useState<TabId>("basic");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const s = await getStudent(id);
    setStudent(s ?? null);
    if (s) {
      const latest = await getLatestQuickLog(s.id);
      setLatestLog(latest ?? null);
      const list = await getQuickLogsByStudent(s.id);
      setLogs(list);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    if (!student) return;
    setShowDeleteConfirm(false);
    await deleteStudent(student.id);
    router.push("/");
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
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted">← ホーム</Link>
        <Link
          href={`/students/${id}/edit`}
          className="rounded-xl border border-primary bg-card px-3 py-2 text-sm text-primary"
        >
          編集
        </Link>
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
        {student.favoriteDrink && (
          <p className="text-sm text-muted mt-1">好きな食べもの・飲みもの: {student.favoriteDrink}</p>
        )}
      </div>

      {latestLog && (
        <section className="space-y-4 mb-6">
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <h2 className="text-xs font-medium text-muted mb-2">前回の要点</h2>
            <p className="text-sm text-text whitespace-pre-wrap">{latestLog.talked || "（記録なし）"}</p>
          </div>
          <div className="bg-accent/30 rounded-2xl p-4 shadow-soft">
            <h2 className="text-xs font-medium text-muted mb-2">次回の一言</h2>
            <p className="text-base font-medium text-text whitespace-pre-wrap">{latestLog.nextTime || "（記録なし）"}</p>
          </div>
        </section>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { id: "basic" as TabId, label: "基本情報" },
          { id: "history" as TabId, label: "レッスン履歴" },
          { id: "memo" as TabId, label: "会話メモ" }
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
                  <li key={log.id} className="text-sm border-b border-border pb-2 last:border-0">
                    <span className="text-muted">
                      第{lessonNum}回 ・{" "}
                      {new Date(log.date).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                    {log.talked && <p className="mt-1 line-clamp-2">{log.talked}</p>}
                  </li>
                );
              })
            )}
          </ul>
        )}
        {tab === "memo" && (
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-muted text-sm">まだ会話メモがありません</p>
            ) : (
              logs.map((log, idx) => {
                const lessonNum = totalCount - idx;
                return (
                  <div key={log.id} className="text-sm pb-3 border-b border-border last:border-0">
                    <span className="text-muted">
                      第{lessonNum}回 ・{" "}
                      {new Date(log.date).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                    {log.talked && <p className="mt-1 whitespace-pre-wrap">{log.talked}</p>}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button onClick={() => setShowDeleteConfirm(true)} className="text-sm text-red-600">
          この生徒さんを削除する
        </button>
      </div>

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
        className="fixed bottom-6 right-4 md:right-6 inline-flex items-center gap-2 pl-5 pr-4 py-3 rounded-full bg-primary text-white shadow-soft active:scale-95 transition-transform text-sm font-medium"
        aria-label="レッスンの記録を追加"
      >
        <span className="text-xl leading-none">＋</span>
        <span>レッスンの記録を追加</span>
      </Link>
    </main>
  );
}
