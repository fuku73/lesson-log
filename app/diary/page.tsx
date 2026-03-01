"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { getAllLessonLogs } from "../../lib/db";
import type { LessonLog } from "../../lib/types";

type DateFilter = "all" | "month" | "today";

function formatDateForDisplay(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function DiaryListPage() {
  const [logs, setLogs] = useState<LessonLog[]>([]);
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  useEffect(() => {
    getAllLessonLogs().then(setLogs).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    let result = logs;

    const q = query.trim();
    if (q) {
      result = result.filter((log) => {
        return (
          log.date.includes(q) ||
          log.content.includes(q) ||
          log.attendees.includes(q)
        );
      });
    }

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    if (dateFilter === "today") {
      result = result.filter((l) => l.date === todayStr);
    } else if (dateFilter === "month") {
      result = result.filter((l) => l.date >= monthStart);
    }

    return result;
  }, [logs, query, dateFilter]);

  return (
    <main className="px-4 pt-6 pb-28 bg-background min-h-screen" style={{ paddingBottom: "max(6rem, calc(1.5rem + env(safe-area-inset-bottom)))" }}>
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted mb-2">
          ← ホーム
        </Link>
        <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          レッスン日誌
        </h1>
        <p className="text-sm text-muted mt-1">
          日ごとのレッスン記録
        </p>
      </header>

      <div className="mb-4">
        <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-3 shadow-soft border border-border/50">
          <FiSearch className="text-primary-dark text-xl shrink-0" aria-hidden />
          <input
            className="w-full bg-transparent text-sm placeholder:text-muted"
            placeholder="日付・内容・来た人で検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { value: "all" as DateFilter, label: "全件" },
          { value: "month" as DateFilter, label: "今月" },
          { value: "today" as DateFilter, label: "今日" }
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setDateFilter(value)}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              dateFilter === value ? "bg-primary text-white" : "bg-sub text-muted hover:bg-border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="space-y-3">
        {filtered.length === 0 ? (
          <div className="mt-8 p-6 rounded-2xl bg-sub/50 border border-border/50 text-center">
            <img src="/diary-empty-icon.png" alt="" className="w-16 h-16 mx-auto mb-3 object-contain" />
            <p className="text-sm text-muted">
              まだ日誌がありません。<br />
              「日誌を書く」ボタンから記録してみましょう。
            </p>
          </div>
        ) : (
          filtered.map((log) => (
            <Link
              key={log.id}
              href={`/diary/${log.id}`}
              className="block bg-card rounded-2xl p-4 shadow-soft border border-border/50 active:scale-[0.99] transition-transform hover:shadow-soft-lg"
            >
              <p className="text-xs text-muted">{formatDateForDisplay(log.date)}</p>
              <p className="text-sm font-medium text-text mt-1 line-clamp-1">{log.content || "—"}</p>
              <p className="text-xs text-muted mt-1">来た人: {log.attendees || "—"}</p>
              {log.revenue != null && (
                <p className="text-xs text-primary-dark mt-1">売上: ¥{log.revenue.toLocaleString()}</p>
              )}
            </Link>
          ))
        )}
      </section>

      <div className="fixed left-0 right-0 flex justify-center" style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
        <Link
          href="/diary/new"
          className="inline-flex items-center gap-2 pl-6 pr-6 py-3 rounded-full shadow-soft-lg active:scale-95 transition-transform text-sm font-medium min-h-[48px] border-2 border-white/50"
          style={{ backgroundColor: "#DDC7C4", color: "#fff" }}
          aria-label="日誌を書く"
        >
          <FiPlus className="text-xl" aria-hidden />
          <span>日誌を書く</span>
        </Link>
      </div>
    </main>
  );
}
