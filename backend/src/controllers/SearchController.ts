import { elasticSearchClient } from "../elasticSearchClient"
import { Request, Response } from "express"

// NOTE: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#use-instance-functions
// メンバ関数にはアロー関数を使っておくと this が undefined にならずに済む
class SearchController {
  searchRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { materials, dish, cookingTime } = req.body
      let cookingTimeQuery
      switch (cookingTime) {
        case "時短":
          cookingTimeQuery = { range: { totalCookingTime: { gt: 0, lte: 15 } } }
          break
        case "普通":
          cookingTimeQuery = { range: { totalCookingTime: { lte: 30 } } }
          break
        case "じっくり":
          cookingTimeQuery = { range: { totalCookingTime: { gt: 30 } } }
          break
        default:
          cookingTimeQuery = { match_all: {} }
      }

      const result = await elasticSearchClient.search({
        index: "recipes",
        body: {
          query: {
            bool: {
              must: [
                cookingTimeQuery,
                {
                  // 何かしら返ってくるようにmatch_allを入れておく
                  match_all: {},
                },
              ],
              should: [
                {
                  term: {
                    dish: {
                      value: dish,
                      boost: 1,
                    },
                  },
                },
                {
                  match: {
                    "materials.readingform": {
                      query: materials.join(" "), // 配列を文字列に変換
                      boost: 1,
                      fuzziness: "AUTO",
                    },
                  },
                },
                {
                  match: {
                    "title.readingform": {
                      query: materials.join(" "), // 配列を文字列に変換
                      boost: 0.5,
                      fuzziness: "AUTO",
                    },
                  },
                },
                {
                  match: {
                    "description.readingform": {
                      query: materials.join(" "), // 配列を文字列に変換
                      boost: 0.2,
                      fuzziness: "AUTO",
                    },
                  },
                },
              ],
            },
          },
          size: 20,
        },
      })

      const hits = result.hits.hits
      if (hits.length === 0) {
        res.status(404).json({ error: "Not found" })
        return
      }
      const recipes = hits.map((hit) => hit._source)
      res.json(recipes)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  searchSomeRecipes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await elasticSearchClient.search({
        index: "recipes",
        body: {
          query: {
            match_all: {},
          },
          size: 30,
        },
      })

      const hits = result.hits.hits
      if (hits.length === 0) {
        res.status(404).json({ error: "Not found" })
        return
      }
      const recipes = hits.map((hit) => hit._source)
      res.json(recipes)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  // TODO: type=keywords
  private searchRecipesWithKeywords = async (req: Request, res: Response): Promise<void> => {
    try {
      const { keywords } = req.body

      const result = await elasticSearchClient.search({
        index: "recipes",
        body: {
          query: {
            bool: {
              should: [
                { bool: { should: [{ terms: { title: keywords } }] } },
                { bool: { should: [{ terms: { description: keywords } }] } },
              ],
            },
          },
        },
      })

      const hits = result.hits.hits
      if (hits.length === 0) {
        res.status(404).json({ error: "Not found" })
        return
      }
      const recipes = hits.map((hit) => hit._source)
      res.json(recipes)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  // TODO: type=query
  private searchRecipesWithQuery = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.body
      const result = await elasticSearchClient.search({
        index: "recipes",
        body: {
          query,
        },
      })

      const hits = result.hits.hits
      if (hits.length === 0) {
        res.status(404).json({ error: "Not found" })
        return
      }
      const recipes = hits.map((hit) => hit._source)
      res.json(recipes)
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

export default new SearchController()
