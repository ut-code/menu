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

  const results = await client.recipes.findMany({
    where: {
      recipeMaterial: {
        hasEvery: searchInfo.ingredient,
      },
    },
    take: 20,
  })
  response.json(results)
})

const server = app.listen(3000)

export default server
