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
              should: [
                {
                  boosting: {
                    positive: {
                      bool: {
                        should: [
                          {
                            match: {
                              title: {
                                query: materials.length > 0 ? materials[0] : "",
                                boost: 1.5,
                                analyzer: "my_ja_analyzer",
                              },
                            },
                          },
                          {
                            match: {
                              description: {
                                query: materials.length > 0 ? materials[0] : "",
                                boost: 1,
                                analyzer: "my_ja_analyzer",
                              },
                            },
                          },
                          // TODO: materialsにもanalyzerを指定する
                          { terms: { materials: materials, boost: 1 } },
                          { term: { dish: { value: dish, boost: 1 } } },
                          cookingTimeQuery,
                        ],
                      },
                    },
                    negative: {
                      bool: {
                        must_not: [{ term: { dish: { value: "" } } }],
                      },
                    },
                    negative_boost: 0.5,
                  },
                },
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

  searchRecipesWithKeywords = async (req: Request, res: Response): Promise<void> => {
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

  searchRecipesWithQuery = async (req: Request, res: Response): Promise<void> => {
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
