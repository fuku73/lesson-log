"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAllStudentsWithLatestLog } from "../lib/db";
import type { StudentWithLatestLog } from "../lib/types";

export default function HomePage() {
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
      const tagPool = [
        ...(s.student.tags ?? []),
        ...(s.latestLog?.tags ?? [])
      ].join(" ").toLowerCase();
      return nameMatch || tagPool.includes(q);
    });
  }, [students, query]);

  return (
    <main className="px-4 pt-6 pb-24">
      <header className="mb-6">
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          おうち教室🏠生徒さんカルテ
        </h1>
        <p className="text-sm text-muted">
          生徒さんの情報とレッスン記録をまとめるノート
        </p>
      </header>

      <div className="mb-4">
        <div className="flex items-center gap-2 bg-card rounded-2xl px-3 py-2 shadow-soft">
          <span className="text-muted text-sm">🔍</span>
          <input
            className="w-full bg-transparent text-sm"
            placeholder="名前・タグで検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted mt-4">
            まだ生徒さんがいません。「＋」ボタンから追加してみましょう。
          </p>
        ) : (
          filtered.map(({ student, latestLog }) => (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="block bg-card rounded-2xl px-3 py-3 shadow-soft active:scale-[0.99] transition-transform"
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
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{student.name}</p>
                      {student.nickname && (
                        <p className="text-[11px] text-muted truncate">{student.nickname}</p>
                      )}
                    </div>
                    {latestLog?.date && (
                      <p className="text-[10px] text-muted whitespace-nowrap">
                        最終:{" "}
                        {new Date(latestLog.date).toLocaleDateString("ja-JP", {
                          month: "short",
                          day: "numeric"
                        })}
                      </p>
                    )}
                  </div>
                  {latestLog?.nextTime && (
                    <p className="text-[11px] text-muted line-clamp-1">
                      次回の一言: {latestLog.nextTime}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {[...(student.tags ?? []), ...(latestLog?.tags ?? [])]
                      .slice(0, 4)
                      .map((tag) => (
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

      <Link
        href="/students/new"
        className="fixed bottom-6 right-4 md:right-6 inline-flex items-center gap-2 pl-5 pr-4 py-3 rounded-full bg-primary text-white shadow-soft active:scale-95 transition-transform text-sm font-medium"
        aria-label="新しい生徒さんカルテを作る"
      >
        <span className="text-xl leading-none">＋</span>
        <span>新しい生徒さんカルテを作る</span>
      </Link>
    </main>
  );
}
