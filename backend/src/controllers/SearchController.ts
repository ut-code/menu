import { client } from "../db.server"
import { Request, Response } from "express"
// import type { Users } from "@prisma/client"

// NOTE: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#use-instance-functions
// メンバ関数にはアロー関数を使っておくと this が undefined にならずに済む
class SearchController {
  searchRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
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
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}

export default new SearchController()
