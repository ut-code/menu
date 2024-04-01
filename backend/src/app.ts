import express from "express"
import cors from "cors"
import UserController from "./controllers/UserController"
import SearchController from "./controllers/SearchController"
import RecipeController from "./controllers/RecipeController"
import { serverUrl } from "./elasticSearchClient"

const app = express()

/*
 * 別ドメインから Fetch API を用いてリクエストを送信可能にするために必要
 * このままだと外部サイトからもリクエストが投げられるようになるので実運用の場合は追加で制限が必要
 * Ref: https://developer.mozilla.org/ja/docs/Web/HTTP/CORS
 */
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("Hello, world!")
})

app.get("/api/elasticsearch/health", async (req, res) => {
  try {
    const health = await fetch(`${serverUrl}`)
    if (health.ok) {
      res.status(200).json({ status: "ok" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Elasticsearch is down" })
  }
})

app.post("/api/searchRecipes", SearchController.searchRecipes)
app.post("/api/searchRecipes/keywords", SearchController.searchRecipesByKeywords)

app.get("/api/users/favorites", UserController.getFavorites)
app.post("/api/users/favorites", UserController.addFavorite)
app.delete("/api/users/favorites/:id", UserController.deleteFavorite)
app.get("/api/users", UserController.getUser)
app.put("/api/users/username", UserController.updateUsername)

app.post("/api/recipes/new", RecipeController.createRecipe)
app.post("/api/recipes/scrape", RecipeController.scrapeRecipe)

export default app
