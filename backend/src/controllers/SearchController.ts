import { client } from "../db.server"
import { elasticSearchClient } from "../elasticSearchClient"
import { Request, Response } from "express"
// import type { Users } from "@prisma/client"

// NOTE: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#use-instance-functions
// メンバ関数にはアロー関数を使っておくと this が undefined にならずに済む
class SearchController {
  private static GOO_API_KEY = process.env.VITE_GOO_API_KEY ?? ""

  indexRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
      const { recipe } = req.body
      const recipeIndex = await elasticSearchClient.index({
        index: "recipes",
        body: recipe,
      })
      res.status(201).json(recipeIndex)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  deleteRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipeId = req.params.id
      const recipeDelete = await elasticSearchClient.delete({
        index: "recipes",
        id: recipeId,
      })
      res.status(200).json(recipeDelete)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

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
                { bool: { should: [{ terms: { materials: materials } }] } },
                {
                  boosting: {
                    positive: {
                      bool: {
                        should: [
                          {
                            term: {
                              title: {
                                value: materials.length > 0 ? materials[0] : "",
                                boost: 1.5,
                                analyzer: "my_ja_analyzer",
                              },
                            },
                          },
                          {
                            term: {
                              description: {
                                value: materials.length > 0 ? materials[0] : "",
                                boost: 1,
                                analyzer: "my_ja_analyzer",
                              },
                            },
                          },
                          { terms: { materials: materials, boost: 1, analyzer: "my_ja_analyzer" } },
                          { term: { dish: { value: dish, boost: 1 } } },
                          cookingTimeQuery,
                        ],
                      },
                    },
                    negative: {
                      bool: {
                        must_not: [{ match: { dish: { query: "" } } }],
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

  searchRecipesOld = async (req: Request, res: Response): Promise<void> => {
    try {
      const { searchInfo } = req.body

      // NOTE: revert this
      // const ingredientsAndQuery = await this.joinIngredients(searchInfo.ingredients)
      const ingredientsAndQuery = searchInfo.ingredients.join(" & ")
      const cookingTimeQuery = this.getCookingTimeQuery(searchInfo.cookingTime)

      const { orderBy, orderDir } = this.getRandomOrder()
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
          dish: searchInfo.dish,
          totalCookingTime: cookingTimeQuery,
        },
        take: 20,
      })

      res.json(recipes)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  searchRecipesByKeywords = async (req: Request, res: Response): Promise<void> => {
    try {
      const { keywords } = req.body
      const keywordsOrQuery = this.joinKeywords(keywords)

      const recipes = await client.recipes.findMany({
        orderBy: {
          _relevance: {
            fields: ["description"],
            search: keywordsOrQuery,
            sort: "desc",
          },
        },
        take: 20,
      })
      res.json(recipes)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  private convertToKatakana = async (sentence: string): Promise<void> => {
    try {
      const response = await fetch("https://labs.goo.ne.jp/api/hiragana", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_id: SearchController.GOO_API_KEY,
          sentence: sentence,
          output_type: "katakana",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        return Promise.reject(error)
      }

      const data = await response.json()
      return data.converted
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  private joinIngredients = async (ingredients: string[]): Promise<string> => {
    try {
      const katakanaIngredientsPromises = ingredients.map(async (ingredient) => {
        // NOTE: this.convertToKatakanaが成功したらその結果を、失敗したら元の文字列を使う
        return await this.convertToKatakana(ingredient).catch(() => ingredient)
      })

      const katakanaIngredients = await Promise.all(katakanaIngredientsPromises)
      console.log(katakanaIngredients)
      return katakanaIngredients.join(" & ")
    } catch (error) {
      console.error(error)
      return ingredients.join(" & ")
    }
  }

  private getCookingTimeQuery = (cookingTime: string): Record<string, number> => {
    switch (cookingTime) {
      case "時短":
        return { gte: 1, lt: 20 }
      case "普通":
        return { gte: 20, lt: 45 }
      case "じっくり":
        return { gte: 45 }
      default:
        return {}
    }
  }

  private getRandomOrder = (): { orderBy: string; orderDir: string } => {
    const orderBy = Math.random() < 0.5 ? "description" : "materialsConverted"
    const orderDir = Math.random() < 0.5 ? "asc" : "desc"
    return { orderBy, orderDir }
  }

  private joinKeywords = (keywords: string | null): string => {
    // FIXME: keywords が空白のみのときのエラーを無理やり回避している
    const keywordsFiltered = keywords?.replace(/\s{2,}/g, " ")
    if (!keywordsFiltered || keywordsFiltered === " ") return ""
    return keywordsFiltered.replace(/\s+/g, " | ")
  }
}

export default new SearchController()
