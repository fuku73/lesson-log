# おうち教室🏠生徒さんカルテ

おうち教室の先生のための、生徒さん情報のやさしい記録アプリです。

## 機能

- 生徒一覧・検索・新規追加
- 生徒詳細（基本情報、レッスン履歴、会話メモ）
- 3分で記録（今日話したこと、様子、次回の一言、タグ）
- PWA対応（オフラインで使える）
- データは端末内のみ（IndexedDB）、外部送信なし

## 技術構成

- Next.js 13 (App Router) + TypeScript + Tailwind CSS
- IndexedDB（ネイティブAPI使用、外部パッケージなし）
- PWA: manifest.json + Service Worker

## セットアップ

```bash
npm install --ignore-scripts
npm run dev
```

ブラウザで http://localhost:3000 を開く。

## ビルド・デプロイ

```bash
npm run build
npm run start
```

Vercel にデプロイする場合: リポジトリを GitHub にプッシュし、Vercel で New Project からインポートするだけです。`.npmrc` により `ignore-scripts=true` が設定されており、ビルド時の依存関係エラーを回避します。

## 注意

- `npm install` は `--ignore-scripts` 付きで実行してください（または `.npmrc` により自動でスキップされます）
