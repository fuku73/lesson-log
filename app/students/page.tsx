"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { getAllStudentsWithLatestLog } from "../../lib/db";
import type { StudentWithLatestLog } from "../../lib/types";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithLatestLog[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllStudentsWithLatestLog().then(setStudents).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const nameMatch =
        s.student.name.toLowerCase().includes(q) ||
        (s.student.nickname ?? "").toLowerCase().includes(q);
      const lessonMatch = (s.latestLog?.lessonAttended ?? "").toLowerCase().includes(q);
      const tagPool = (s.student.tags ?? []).join(" ").toLowerCase();
      return nameMatch || lessonMatch || tagPool.includes(q);
    });
  }, [students, query]);

  return (
    <main className="px-4 pt-6 pb-28 bg-background min-h-screen" style={{ paddingBottom: "max(6rem, calc(1.5rem + env(safe-area-inset-bottom)))" }}>
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted mb-2">
          ← ホーム
        </Link>
        <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          生徒さんノート
        </h1>
        <p className="text-sm text-muted mt-1">
          生徒ごとの情報とレッスン履歴
        </p>
      </header>

      <div className="mb-4">
        <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-3 shadow-soft border border-border/50">
          <FiSearch className="text-primary-dark text-xl shrink-0" aria-hidden />
          <input
            className="w-full bg-transparent text-sm placeholder:text-muted"
            placeholder="名前・ニックネームで検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="space-y-3">
        {filtered.length === 0 ? (
          <div className="mt-8 p-6 rounded-2xl bg-sub/50 border border-border/50 text-center">
            <img src="/empty-icon.png" alt="" className="w-16 h-16 mx-auto mb-3 object-contain" />
            <p className="text-sm text-muted">
              まだ生徒さんがいません。<br />
              「追加」ボタンから追加してみましょう。
            </p>
          </div>
        ) : (
          filtered.map(({ student, latestLog }) => (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="block bg-card rounded-2xl px-4 py-4 shadow-soft border border-border/50 active:scale-[0.99] transition-transform hover:shadow-soft-lg"
            >
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full bg-sub flex items-center justify-center text-sm text-muted overflow-hidden shrink-0">
                  {student.photo ? (
                    <img
                      src={student.photo}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{student.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{student.name}</p>
                  {student.nickname && (
                    <p className="text-[11px] text-muted truncate">{student.nickname}</p>
                  )}
                  {latestLog?.date && (
                    <p className="text-[10px] text-muted mt-0.5">
                      最終:{" "}
                      {new Date(latestLog.date).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {[...(student.tags ?? []), latestLog?.lessonAttended].filter(Boolean).slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-sub text-[10px] px-2 py-0.5 text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>

      <div className="fixed left-0 right-0 flex justify-center" style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
        <Link
          href="/students/new"
          className="inline-flex items-center gap-2 pl-6 pr-6 py-3 rounded-full shadow-soft-lg active:scale-95 transition-transform text-sm font-medium min-h-[48px] border-2 border-white/50"
          style={{ backgroundColor: "#DDC7C4", color: "#fff" }}
          aria-label="生徒さんを追加する"
        >
          <FiPlus className="text-xl" aria-hidden />
          <span>生徒さんを追加する</span>
        </Link>
      </div>
    </main>
  );
}
