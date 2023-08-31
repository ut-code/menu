import express from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import { extractUserFromRequest } from "./utils/authUtils"

const client = new PrismaClient()
const app = express()

/*
 * 別ドメインから Fetch API を用いてリクエストを送信可能にするために必要
 * このままだと外部サイトからもリクエストが投げられるようになるので実運用の場合は追加で制限が必要
 * 参考: https://developer.mozilla.org/ja/docs/Web/HTTP/CORS
 */
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//----------------------------------------------------------------
// Result.tsx用
//----------------------------------------------------------------
// request.bodyのsearchInfoを利用して検索結果を返す
export type SearchInfo = {
  ingredients: string[]
  time?: string
  dish?: string // 主菜・副菜など
  keywords?: string[]
}

app.post("/api/searchRecipes", async (req, res) => {
  const searchInfo: SearchInfo = req.body.content
  console.log(searchInfo.ingredients) // こういう風にデバッグできます。backendのターミナルで見てみてください

  const ingredientsAndQuery: string = searchInfo.ingredients.join(" & ")
  const recipes = await client.recipes.findMany({
    where: {
      recipeMaterialConverted: {
        search: ingredientsAndQuery,
      },
    },
    take: 20,
  })
  res.json(recipes)
})

app.get("/api/users/favorites", async (req, res) => {
  const user = await extractUserFromRequest(req)
  if (!user) {
    res.status(401).json({ error: "Not authorized" })
    return
  }

  const recipes = await client.userFavorites.findMany({
    where: {
      userId: user.id,
    },
    include: {
      favoriteRecipe: true,
    },
  })
  res.json(recipes)
})

app.post("/api/users/favorites", async (req, res) => {
  const { recipeId } = req.body
  const user = await extractUserFromRequest(req)
  if (!user) {
    res.status(401).json({ error: "Not authorized" })
    return
  }

  const existingFavorite = await client.userFavorites.findUnique({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId: recipeId,
      },
    },
  })
  if (existingFavorite) {
    res.json(existingFavorite)
    return
  }

  const userFavorite = await client.userFavorites.create({
    data: {
      userId: user.id,
      recipeId: recipeId,
    },
  })
  res.json(userFavorite)
})

app.delete("/api/users/favorites/:id", async (req, res) => {
  const recipeId = Number(req.params.id)
  const user = await extractUserFromRequest(req)
  if (!user) {
    res.status(401).json({ error: "Not authorized" })
    return
  }

  const userFavorite = await client.userFavorites.delete({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId: recipeId,
      },
    },
  })
  res.json(userFavorite)
})

export default app
