## だるめし

@ここにいい感じのバナー画像が入る@

@バナーに貼るリンク https://dull-meshi.onrender.com/ @

だるめし: 質問に答えていくだけで献立を提案してくれるアプリ

<p>
  <img src="https://github.com/ut-code/menu/assets/53532178/0f5152a2-5d85-4261-90f0-855e14ed86f5") width="200" />
  <img src="https://github.com/ut-code/menu/assets/53532178/dc74d07f-2b19-4330-87ca-2a412caa9c92") width="200" />
  <img src="https://github.com/ut-code/menu/assets/53532178/55f08e78-d5a7-4048-9963-ad730e658e04") width="200" />
  <img src="https://github.com/ut-code/menu/assets/53532178/6eb799e5-3f34-451a-99b5-2319db85fed2") width="200" />
</p>

<br></br>
## 開発した背景

[ある調査](https://news.mynavi.jp/article/20220407-2315146/)によると、自炊をしない理由の第一位は<b>「面倒だから」</b>。そんな悩みを解決するのが本サービスです。

各レシピサイトのレシピを横断的に検索。お気に入りのレシピを見つけやすくなります！

＠もう少し膨らます＠

<br></br>
## 使用技術

<p style="display: inline">
  <img src="https://img.shields.io/badge/-React-000000.svg?logo=react&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Vite-000000.svg?logo=vite&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Express-000000.svg?logo=express&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Supabase-000000.svg?logo=supabase&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Prisma-000000.svg?logo=prisma&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Typescript-000000.svg?logo=Typescript&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Node.js-000000.svg?logo=node.js&style=for-the-badge">
</p>

- バックエンド
  - Express / Typescript
  - Supabase
  - Prisma
- フロントエンド
  - React / Typescript
  - Vite
  - CSS Modules
- インフラ
  - Render
  - GitHub Actions

<br></br>
## 環境構築

### セットアップ

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

### サーバの起動

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

### テスト

`backend` ディレクトリに移動

```shell
npx jest
```

`frontend` ディレクトリに移動

```shell
npx vitest
```
