# 献立作成システム（仮）

https://dull-meshi.onrender.com/
質問に答えていくだけで献立を提案してくれるアプリ

## 環境構築

Node.js のインストール

```shell
git clone git@github.com:ut-code/menu.git
```

```shell
cd menu
```

```shell
npm ci
```

`backend` ディレクトリに移動（`cd backend`）

```shell
npm run setup:env
```

`.env` ファイルに `DATABASE_URL` と `SUPABASE_URL` と `SUPABASE_ANON_KEY` を埋める。

```shell
npm run setup
```

`frontend` ディレクトリに移動（`cd frontend`）

```shell
npm run setup:env
```

`.env` ファイルに `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を埋める。

```shell
npm run setup
```

## サーバの起動

`backend` ディレクトリに移動

```shell
npm run dev
```

Terminal をもう一つ開く

`frontend` ディレクトリに移動

```shell
npm run dev
```

ブラウザで [`http://localhost:5173`](http://localhost:5173) にアクセスすると、表示されるはずです。

## ディレクトリ構成

- `/root`

  - `/frontend` フロントエンド

    - `/src`

      - `/assets`

      - `/components`

      - `/features`

  - `/backend` バックエンド

    - `/src`

      - `server.ts`

    - `/prisma`
