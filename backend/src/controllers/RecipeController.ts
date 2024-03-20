import { client } from "../db.server"
import { chromium } from "playwright"
import { Request, Response } from "express"
import { extractUserFromRequest } from "../utils/UserUtil"
import type { Recipes } from "@prisma/client"

// NOTE: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#use-instance-functions
// メンバ関数にはアロー関数を使っておくと this が undefined にならずに済む
class RecipeController {
  createRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userFromRequest = await extractUserFromRequest(req)
      if (!userFromRequest) {
        res.status(401).json({ error: "Not authorized" })
        return
      }

      const { title, description, totalCookingTime, materials, sourceUrl, foodImageUrl, dish } = req.body
      const materialsConverted = this.convertMaterials(materials)
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

      console.log("started")
      const browser = await chromium.launch()
      const context = await browser.newContext()
      const page = await context.newPage()
      // Ref) https://playwright.dev/docs/api/class-page#page-goto
      await page.goto(sourceUrl, { waitUntil: "domcontentloaded" })

      const recipeData = await page.evaluate(() => {
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

      console.log(recipeData)
      if (!recipeData) {
        res.status(400).json({ error: "Could not find structured recipe data" })
        return
      }
      const recipeResponse = {
        title: recipeData.name,
        description: recipeData.description,
        totalCookingTime: recipeData.totalTime,
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
      Array.isArray(data.keywords) &&
      typeof data.sourceUrl === "string" &&
      typeof data.foodImageUrl === "string" &&
      (typeof data.dish === "string" || data.dish === undefined)
    )
  }

  private convertMaterials = (materials: string[]): string => {
    return materials.join(",")
  }

  private convertKeywords = (keywords: string): string[] => {
    return keywords.split(",").map((keyword) => keyword.trim())
  }
}

export default new RecipeController()
