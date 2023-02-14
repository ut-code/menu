# 献立作成システム（仮）

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

`.env` ファイルに `DATABASE_URL="データベースのURL"` となるように書く。

```shell
npm run setup
```

`frontend` ディレクトリに移動（`cd frontend`）

```shell
npm run setup:env
```

`.env` ファイルには何もしなくてよい。

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

ブラウザで [`http://localhost:3000/home`](http://localhost:3000/home) にアクセスすると、表示されるはずです。

## ディレクトリ構成

- `/root`

  - `/frontend` フロントエンド関係

    - `/src`

      - `/assets`
        画像や CSS など

      - `/components`
        コンポーネント

      - `/pages`
        ホームページ

        - `Home.tsx`
          開発の都合で設置。困ったら/home

        - `Message.tsx`
          [`https://github.com/ut-code/typescript-react-node-template`](https://github.com/ut-code/typescript-react-node-template)
        - `Questions.tsx`
          質問形式で条件を聞き出す。/questions

    - `/dist` ビルド時に自動で作られる? 編集はしない。

  - `/backend` バックエンド関係

    - `server.ts` メイン

    - `/prisma` Prisma のファイル
