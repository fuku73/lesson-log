"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"show" | "fade" | "hidden">("show");

  useEffect(() => {
    const showTimer = setTimeout(() => setPhase("fade"), 1800);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (phase !== "fade") return;
    const hideTimer = setTimeout(() => setPhase("hidden"), 400);
    return () => clearTimeout(hideTimer);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300"
      style={{
        backgroundColor: "#F5F3F0",
        opacity: phase === "show" ? 1 : 0,
        pointerEvents: "auto"
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <img
          src="/logo.png"
          alt=""
          className="w-24 h-24 object-contain drop-shadow-sm mb-4"
        />
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-heading)", color: "#4A4A4A" }}
        >
          レッスンログ
        </h1>
        <p className="text-sm mt-1" style={{ color: "#9B9B9B" }}>
          レッスン記録をまとめるノート
        </p>
      </div>
    </div>
  );
}
