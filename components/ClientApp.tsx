"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";

export default function ClientApp({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"splash" | "fading" | "content">("splash");

  useEffect(() => {
    const showTimer = setTimeout(() => setPhase("fading"), 3000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (phase === "fading") {
      const hideTimer = setTimeout(() => setPhase("content"), 500);
      return () => clearTimeout(hideTimer);
    }
  }, [phase]);

  return (
    <>
      {phase !== "content" && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-500 ${
            phase === "splash" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <SplashScreen />
        </div>
      )}
      <div
        className={
          phase === "content"
            ? "opacity-100 transition-opacity duration-500"
            : "opacity-0"
        }
      >
        {children}
      </div>
    </>
  );
}
