# 献立作成システム（仮）

https://dull-meshi.onrender.com/
質問に答えていくだけで献立を提案してくれるアプリ

## 環境構築

Node.js のインストール

```shell
git clone git@github.com:ut-code/menu.git
```

```shell(in your_path/menu directory)
npm run setup
```

### 環境変数

frontend と backend でそれぞれ`.env`ファイルを作成してください。
frontend の`.env`ファイルには以下のように記述してください。

```
WEB_ORIGIN=http://localhost:5173
VITE_API_ENDPOINT=http://localhost:3000
VITE_SUPABASE_URL="supabaseのURL"
VITE_SUPABASE_ANON_KEY="supabaseのanon_key"
```

現状では、`backend`の`.env`は何も記述する必要はありません。

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

ブラウザで [`http://localhost:5173/home`](http://localhost:5173/home) にアクセスすると、表示されるはずです。

## ディレクトリ構成

- `/root`

  - `/frontend` フロントエンド

    - `/src`

      - `/assets`

      - `/components`

      - `/pages`

  - `/backend` バックエンド

    - `/src`

      - `server.ts`

    - `/prisma` Prisma の構成ファイルと Python
