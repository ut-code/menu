import { client } from "../db.server"
import { chromium } from "playwright"
import { Request, Response } from "express"
import { extractUserFromRequest } from "../utils/UserUtil"
import type { Recipes } from "@prisma/client"
import { elasticSearchClient } from "../elasticSearchClient"

// NOTE: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#use-instance-functions
// メンバ関数にはアロー関数を使っておくと this が undefined にならずに済む
class RecipeController {
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

  createRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userFromRequest = await extractUserFromRequest(req)
      if (!userFromRequest) {
        res.status(401).json({ error: "Not authorized" })
        return
      }

      const { title, description, totalCookingTime, materials, materialsConverted, sourceUrl, foodImageUrl, dish } =
        req.body
      if (
        !this.isRecipe({
          title,
          description,
          totalCookingTime,
          materials,
          materialsConverted,
          sourceUrl,
          foodImageUrl,
          dish,
        })
      ) {
        res.status(400).json({ error: "Invalid recipe" })
        return
      }

      const recipe = await client.recipes.create({
        data: {
          title: title,
          description: description,
          totalCookingTime: totalCookingTime,
          materials: materials,
          materialsConverted: materialsConverted,
          keywords: [],
          sourceUrl: sourceUrl,
          foodImageUrl: foodImageUrl,
          dish: dish,
        },
      })
      if (!recipe) {
        res.status(500).json({ error: "Failed to create recipe" })
        return
      }

      const submission = await client.recipeSubmissions.create({
        data: {
          recipeId: recipe.id,
          userId: userFromRequest.id,
        },
      })
      if (!submission) {
        res.status(500).json({ error: "Failed to create submission" })
        return
      }

      res.status(201).json(submission)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  scrapeRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userFromRequest = await extractUserFromRequest(req)
      if (!userFromRequest) {
        // res.status(401).json({ error: "Not authorized" })
        // return
        console.log("Not authorized")
      }

      const { sourceUrl } = req.body

      const browser = await chromium.launch()
      const context = await browser.newContext()
      const page = await context.newPage()
      // Ref) https://playwright.dev/docs/api/class-page#page-goto
      await page.goto(sourceUrl, { waitUntil: "domcontentloaded" })

      const recipeData = await page.evaluate(() => {
        // FIXME: 複数のタグがある場合に対応させる
        const scriptTag = document.querySelector("script[type='application/ld+json']")
        if (!scriptTag) {
          return null
        }
        const recipeJson = JSON.parse(scriptTag.innerHTML)
        if (recipeJson["@type"] !== "Recipe") {
          return null
        }
        return recipeJson
      })

      await browser.close()

      // console.log(recipeData)
      if (!recipeData) {
        res.status(400).json({ error: "Could not find structured recipe data" })
        return
      }
      const recipeResponse = {
        title: recipeData.name,
        description: recipeData.description,
        totalCookingTime: this.convertTotalCookingTimeToMinutes(recipeData.totalTime),
        materials: recipeData.recipeIngredient,
        keywords: this.convertKeywords(recipeData.keywords),
        sourceUrl: sourceUrl,
        foodImageUrl: recipeData.image[0],
        dish: recipeData.recipeCategory,
      }
      res.status(200).json(recipeResponse)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isRecipe = (data: any): data is Recipes => {
    // Ref) https://typescriptbook.jp/reference/functions/type-guard-functions
    return (
      typeof data.title === "string" &&
      typeof data.description === "string" &&
      typeof data.totalCookingTime === "number" &&
      Array.isArray(data.materials) &&
      typeof data.materialsConverted === "string" &&
      // Array.isArray(data.keywords) &&
      typeof data.sourceUrl === "string" &&
      typeof data.foodImageUrl === "string" &&
      (typeof data.dish === "string" || data.dish === undefined)
    )
  }

  private convertKeywords = (keywords: string): string[] => {
    return keywords.split(",").map((keyword) => keyword.trim())
  }

  private convertTotalCookingTimeToMinutes = (totalTime: string): number => {
    if (!totalTime || totalTime.length < 2) {
      return -1
    }
    const time = totalTime.substring(2)
    let minutes = 0
    const hoursMatch = time.match(/(\d+)H/)
    if (hoursMatch) {
      minutes += parseInt(hoursMatch[1]) * 60
    }
    const minutesMatch = time.match(/(\d+)M/)
    if (minutesMatch) {
      minutes += parseInt(minutesMatch[1])
    }
    return minutes
  }
}

export default new RecipeController()
