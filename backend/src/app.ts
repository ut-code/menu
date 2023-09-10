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

export type SearchInfo = {
  ingredients: string[]
  time?: string
  dish?: string // 主菜・副菜など
}

app.post("/api/searchRecipes", async (req, res) => {
  const { searchInfo } = req.body
  const ingredientsAndQuery: string = searchInfo.ingredients.join(" & ")
  let timeQuery = {}
  switch (searchInfo.time) {
    case "時短":
      timeQuery = { gte: 1, lt: 15 }
      break
    case "普通":
      timeQuery = { gte: 15, lt: 45 }
      break
    case "じっくり":
      timeQuery = { gte: 45 }
      break
    default:
      break
  }

  const orderBy = Math.random() < 0.5 ? "recipeDescription" : "recipeMaterialConverted"
  const orderDir = Math.random() < 0.5 ? "asc" : "desc"
  // const itemCount = await client.recipes.count()
  // const skip = Math.max(0, Math.floor(Math.random() * itemCount) - 5000)

  const recipes = await client.recipes.findMany({
    orderBy: {
      [orderBy]: orderDir,
    },
    // FIXME: skip をすると全部消えてしまう, ランダムサンプリングの書き方が弱い(rawSQLにする?)
    // skip: skip,
    where: {
      recipeMaterialConverted: {
        search: ingredientsAndQuery,
      },
      totalTime: timeQuery,
    },
    take: 20,
  })
  console.log(searchInfo)
  console.log(recipes)
  res.json(recipes)
})

app.post("/api/searchRecipes/keywords", async (req, res) => {
  const { keywords } = req.body
  const keywordsOrQuery: string = keywords.join(" | ") || ""
  const recipes = await client.recipes.findMany({
    orderBy: {
      _relevance: {
        fields: ["recipeDescription"],
        search: keywordsOrQuery,
        sort: "asc",
      },
    },
    take: 20,
  })
  console.log(keywords)
  console.log(recipes)
  res.json(recipes)
})

app.get("/api/users/favorites", async (req, res) => {
  const user = await extractUserFromRequest(req)
  if (!user) {
    res.status(401).json({ error: "Not authorized" })
    return
  }

  const favorites = await client.userFavorites.findMany({
    where: {
      userId: user.id,
    },
    include: {
      favoriteRecipe: true,
    },
  })
  const recipes = favorites.map((favorite) => favorite.favoriteRecipe)
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

app.put("/api/users/username", async (req, res) => {
  console.log(req)
  const user = await extractUserFromRequest(req)
  if (!user) {
    res.status(401).json({ error: "Not authorized" })
    return res.json("名無し")
  }
  const { username } = req.body
  const updatedUser = await client.users.update({
    where: {
      id: user.id,
    },
    data: {
      username: username,
    },
  })
  res.json(updatedUser)
})

app.get("/api/users/username", async (req, res) => {
  const user = await extractUserFromRequest(req)
  if (!user) {
    res.status(401).json({ error: "Not authorized" })
    return
  }
  const user2 = await client.users.findUnique({
    where: {
      id: user.id,
    },
  })
  res.json(user2?.username)
})

export default app
