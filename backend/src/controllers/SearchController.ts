import { client } from "../db.server"
import { Request, Response } from "express"
// import type { Users } from "@prisma/client"

// NOTE: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#use-instance-functions
// メンバ関数にはアロー関数を使っておくと this が undefined にならずに済む
class SearchController {
  searchRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { searchInfo } = req.body

      const ingredientsAndQuery = this.joinIngredients(searchInfo.ingredients)
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
      // FIXME: 関連性のある結果が全く得られない
      const { keywords } = req.body
      const keywordsOrQuery = this.joinKeywords(keywords)

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
      res.json(recipes)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  private joinIngredients = (ingredients: string[]): string => {
    return ingredients.join(" & ")
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
