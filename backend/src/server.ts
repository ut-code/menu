import express from "express"
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
// request.bodyのsearchInfoを利用して検索結果を返す
// 一旦は楽天レシピオンリーで検索
type SearchInfo = {
  ingredient: string[]
  // あとで増やす
}

app.post("/searchRecipes", async (request, response) => {
  const searchInfo: SearchInfo = request.body.content
  console.log(searchInfo.ingredient) // こういう風にデバッグできます。backendのターミナルで見てみてください

  const results = await client.recipesTmp.findMany({
    where: {
      recipeMaterial: {
        hasEvery: searchInfo.ingredient,
      },
    },
    take: 8,
  })
  response.json(results)
})

app.listen(3000)
