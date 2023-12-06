import express from "express"
import cors from "cors"
import { client } from "./db.server"
import UserController from "./controllers/UserController"
import SearchController from "./controllers/SearchController"

const app = express()

/*
 * 別ドメインから Fetch API を用いてリクエストを送信可能にするために必要
 * このままだと外部サイトからもリクエストが投げられるようになるので実運用の場合は追加で制限が必要
 * 参考: https://developer.mozilla.org/ja/docs/Web/HTTP/CORS
 */
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/api/searchRecipes", SearchController.searchRecipes)

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
