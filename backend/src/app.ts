import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "../../openapi.json"
import UserController from "./controllers/UserController"
import SearchController from "./controllers/SearchController"
import RecipeController from "./controllers/RecipeController"
import { elasticSearchClient } from "./elasticSearchClient"
import type { paths } from "../../types/openapi-types"

const app = express()

/*
 * 別ドメインから Fetch API を用いてリクエストを送信可能にするために必要
 * このままだと外部サイトからもリクエストが投げられるようになるので実運用の場合は追加で制限が必要
 * Ref: https://developer.mozilla.org/ja/docs/Web/HTTP/CORS
 */
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (_req, res) => {
  res.status(200).send("Hello, world!")
})

type SuccessResponse = paths["/api/elasticsearch/health"]["get"]["responses"]["200"]["content"]["application/json"]
type ErrorResponse = paths["/api/elasticsearch/health"]["get"]["responses"]["500"]["content"]["application/json"]

app.get("/api/elasticsearch/health", async (_req, res) => {
  try {
    const health = await elasticSearchClient.cat.health({ format: "json" })
    const response: SuccessResponse = health as SuccessResponse
    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    const response: ErrorResponse = { message: "Elasticsearch is down" }
    res.status(500).json(response)
  }
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.post("/api/recipes/search", SearchController.searchRecipes)
app.post("/api/recipes/search/keywords", SearchController.searchRecipesWithKeywords)
app.post("/api/recipes/search/query", SearchController.searchRecipesWithQuery)

app.get("/api/users/favorites", UserController.getFavorites)
app.post("/api/users/favorites", UserController.addFavorite)
app.delete("/api/users/favorites/:id", UserController.deleteFavorite)
app.get("/api/users", UserController.getUser)

app.post("/api/recipes/:index", RecipeController.recreateIndex)
app.post("/api/recipes", RecipeController.indexRecipe)
app.post("/api/recipes/bulk", RecipeController.bulkIndexRecipes)
app.delete("/api/recipes/:id", RecipeController.deleteRecipe)
app.post("/api/recipes/new", RecipeController.createRecipe)
app.post("/api/recipes/scrape", RecipeController.scrapeRecipe)

export default app
