import express from "express"
import cors from "cors"
import { client } from "./db.server"
import UserController from "./controllers/UserController"

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
  dish: string | null
  cookingTime: string | null
}

app.post("/api/searchRecipes", async (req, res) => {
  const { searchInfo } = req.body
  const ingredientsAndQuery: string = searchInfo.ingredients.join(" & ")
  const dishQuery = searchInfo.dish
  let cookingTimeQuery = {}
  switch (searchInfo.cookingTime) {
    case "時短":
      cookingTimeQuery = { gte: 1, lt: 20 }
      break
    case "普通":
      cookingTimeQuery = { gte: 20, lt: 45 }
      break
    case "じっくり":
      cookingTimeQuery = { gte: 45 }
      break
    default:
      break
  }

  const orderBy = Math.random() < 0.5 ? "description" : "materialsConverted"
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
      materialsConverted: {
        search: ingredientsAndQuery,
      },
      dish: dishQuery,
      totalCookingTime: cookingTimeQuery,
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
        fields: ["description"],
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

app.get("/api/users/favorites", UserController.getFavorites)
app.post("/api/users/favorites", UserController.addFavorite)
app.delete("/api/users/favorites/:id", UserController.deleteFavorite)
app.get("/api/users", UserController.getUser)
app.put("/api/users/username", UserController.updateUsername)

export default app
