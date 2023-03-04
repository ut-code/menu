import express, { response } from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()
const app = express()

/*
 * 別ドメインから Fetch API を用いてリクエストを送信可能にするために必要
 * このままだと外部サイトからもリクエストが投げられるようになるので実運用の場合は追加で制限が必要
 * 参考: https://developer.mozilla.org/ja/docs/Web/HTTP/CORS
 */
app.use(cors())

app.use(express.json())

//----------------------------------------------------------------
// Message.tsx用
//----------------------------------------------------------------
// データベースからメッセージの一覧を取得
app.get("/messages", async (request, response) => {
  response.json(await client.message.findMany())
})

// request.body.content に含まれるメッセージをデータベースに保存
app.post("/send", async (request, response) => {
  await client.message.create({ data: { content: request.body.content } })
  response.send()
})

//----------------------------------------------------------------
// Result.tsx用
//----------------------------------------------------------------
app.post("/searchRecipes", async (request, response) => {
  const searchInfo = request.body.content

  console.log(searchInfo) // こういう風にデバッグできます。backendのターミナルで見てみてください
  // @@@@@ ここに検索処理を書く
  // await client.recipesTmp.findMany( 本番はRecipesTmpではなくRecipesを使うことになります
  //   {
  //     where: {
  //   }
  // )
  response.json([
    {
      recipeTitle: "豚肉と玉ねぎの炒め物",
      recipeUrl: "https://www.kurashiru.com/recipes/f5ae0ab0-52b9-419b-8da9-aa8e004ee8d2",
      recipeDescription: "String",
      foodImageUrls: [
        "https://recipe.r10s.jp/recipe-space/d/strg/ctrl/3/e077438a9b2b2bcd4a101714556aeda732b37b2f.05.9.3.3.jpg?interpolation=lanczos-none&fit=around|716:716&crop=716:716;*,*",
      ],
      keywords: ["String"],
      totalTime: 100,
      recipeMaterial: ["豚肉", "玉ねぎ", "にんにく"],
    },
  ])
})

// Vite が標準で 3000 番ポートを使うので 3001 しておく
app.listen(3001)
