import "./globals.css";
import React from "react";
import PWAProvider from "./PWAProvider";

export const metadata = {
  title: "レッスンログ",
  description: "レッスン記録をまとめるやさしい記録アプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "レッスンログ"
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#DDC7C4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
        />
      </head>
      <body className="text-text min-h-screen" style={{ backgroundColor: "#F5F3F0" }}>
        <PWAProvider />
        <div className="min-h-screen max-w-md mx-auto" style={{ backgroundColor: "#F5F3F0" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
