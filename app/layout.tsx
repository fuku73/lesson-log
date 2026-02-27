import "./globals.css";
import React from "react";
import PWAProvider from "./PWAProvider";

export const metadata = {
  title: "おうち教室🏠生徒さんカルテ",
  description: "おうち教室の先生のための、生徒さん情報のやさしい記録アプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "生徒さんカルテ"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#6B8E7E" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
        />
      </head>
      <body className="bg-background text-text">
        <PWAProvider />
        <div className="min-h-screen max-w-md mx-auto bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
