"use client";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ backgroundColor: "#F5F3F0" }}>
      <div className="flex flex-col items-center gap-5">
        <img src="/logo.png" alt="" className="w-20 h-20 object-contain" />
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#4A4A4A" }}>
          レッスンログ
        </h1>
        <p className="text-sm" style={{ color: "#9B9B9B" }}>by おうち教室ふくふく</p>
      </div>
    </div>
  );
}
