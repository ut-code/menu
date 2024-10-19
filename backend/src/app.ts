import express from "express"
import cors from "cors"
import morgan from "morgan"
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

// morgan でリクエストボディとレスポンスボディをログ出力する
// Ref: https://www.npmjs.com/package/morgan-body
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logBodyGen(prependStr: string, getBodyFunc: (req: any, res: any) => string) {
  const bodyFormatName = "bodyFmt_" + prependStr
  morgan.format(bodyFormatName, function logBody(_, req, res) {
    const url = req.url
    const method = req.method
    const status = res.statusCode
    const body = getBodyFunc(req, res)
    const timeStamp = new Date().toISOString()
    return `[${timeStamp}] ${method} ${url} ${status} ${prependStr}: ${JSON.stringify(body)}`
  })
  return bodyFormatName
}

const appResponsePrototype = Object.getPrototypeOf(app.response)
const originalSend = appResponsePrototype.send
const morganBodyResponseSymbol = Symbol()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
appResponsePrototype.send = function sendOverWrite(body: any) {
  originalSend.call(this, body)
  this[morganBodyResponseSymbol] = body
}

app.use(morgan("[:date[iso]] :method :url :status ResponseTime :response-time ms"))
app.use(morgan(logBodyGen("RequestBody", (req) => req.body)))
app.use(morgan(logBodyGen("ResponseBody", (_req, res) => res[morganBodyResponseSymbol])))

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

app.get("/api/elasticsearch/indices", async (_req, res) => {
  try {
    const indices = await elasticSearchClient.cat.indices({ format: "json" })
    res.status(200).json(indices)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to get indices" })
  }
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.post("/api/recipes/search", SearchController.searchRecipes)
app.post("/api/recipes/search/some", SearchController.searchSomeRecipes)

app.get("/api/users/favorites", UserController.getFavorites)
app.post("/api/users/favorites", UserController.addFavorite)
app.delete("/api/users/favorites/:id", UserController.deleteFavorite)
app.get("/api/users", UserController.getUser)

app.post("/api/recipes/index/recreate", RecipeController.recreateIndex)
app.post("/api/recipes", RecipeController.indexRecipe)
app.post("/api/recipes/bulk", RecipeController.bulkIndexRecipes)
app.delete("/api/recipes/:id", RecipeController.deleteRecipe)
app.post("/api/recipes/new", RecipeController.createRecipe)
// app.post("/api/recipes/scrape", RecipeController.scrapeRecipe)

export default app
