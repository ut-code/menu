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

  recreateIndex = async (req: Request, res: Response): Promise<void> => {
    try {
      const indexName = req.params.index
      const exists = await elasticSearchClient.indices.exists({
        index: indexName,
      })
      if (!exists) {
        await elasticSearchClient.indices.delete({
          index: indexName,
        })
        console.log(`Index "${indexName}" deleted.`)
      }

      await elasticSearchClient.indices.create({
        index: indexName,
        settings: {
          analysis: {
            analyzer: {
              keyword_analyzer: {
                type: "custom",
                char_filter: ["normalize", "whitespaces"],
                tokenizer: "keyword",
                filter: ["lowercase", "trim", "maxlength"],
              },
              readingform_index_analyzer: {
                type: "custom",
                char_filter: ["normalize", "whitespaces"],
                tokenizer: "japanese_normal",
                filter: ["lowercase", "trim", "readingform", "asciifolding", "maxlength", "engram"],
              },
              readingform_search_analyzer: {
                type: "custom",
                char_filter: ["normalize", "whitespaces", "katakana", "romaji"],
                tokenizer: "japanese_normal",
                filter: ["lowercase", "trim", "maxlength", "readingform", "asciifolding"],
              },
            },
            char_filter: {
              normalize: {
                type: "icu_normalizer",
                name: "nfkc",
                mode: "compose",
              },
              katakana: {
                type: "mapping",
                mappings: [
                  "ぁ=>ァ",
                  "ぃ=>ィ",
                  "ぅ=>ゥ",
                  "ぇ=>ェ",
                  "ぉ=>ォ",
                  "っ=>ッ",
                  "ゃ=>ャ",
                  "ゅ=>ュ",
                  "ょ=>ョ",
                  "が=>ガ",
                  "ぎ=>ギ",
                  "ぐ=>グ",
                  "げ=>ゲ",
                  "ご=>ゴ",
                  "ざ=>ザ",
                  "じ=>ジ",
                  "ず=>ズ",
                  "ぜ=>ゼ",
                  "ぞ=>ゾ",
                  "だ=>ダ",
                  "ぢ=>ヂ",
                  "づ=>ヅ",
                  "で=>デ",
                  "ど=>ド",
                  "ば=>バ",
                  "び=>ビ",
                  "ぶ=>ブ",
                  "べ=>ベ",
                  "ぼ=>ボ",
                  "ぱ=>パ",
                  "ぴ=>ピ",
                  "ぷ=>プ",
                  "ぺ=>ペ",
                  "ぽ=>ポ",
                  "ゔ=>ヴ",
                  "あ=>ア",
                  "い=>イ",
                  "う=>ウ",
                  "え=>エ",
                  "お=>オ",
                  "か=>カ",
                  "き=>キ",
                  "く=>ク",
                  "け=>ケ",
                  "こ=>コ",
                  "さ=>サ",
                  "し=>シ",
                  "す=>ス",
                  "せ=>セ",
                  "そ=>ソ",
                  "た=>タ",
                  "ち=>チ",
                  "つ=>ツ",
                  "て=>テ",
                  "と=>ト",
                  "な=>ナ",
                  "に=>ニ",
                  "ぬ=>ヌ",
                  "ね=>ネ",
                  "の=>ノ",
                  "は=>ハ",
                  "ひ=>ヒ",
                  "ふ=>フ",
                  "へ=>ヘ",
                  "ほ=>ホ",
                  "ま=>マ",
                  "み=>ミ",
                  "む=>ム",
                  "め=>メ",
                  "も=>モ",
                  "や=>ヤ",
                  "ゆ=>ユ",
                  "よ=>ヨ",
                  "ら=>ラ",
                  "り=>リ",
                  "る=>ル",
                  "れ=>レ",
                  "ろ=>ロ",
                  "わ=>ワ",
                  "を=>ヲ",
                  "ん=>ン",
                ],
              },
              romaji: {
                type: "mapping",
                mappings: [
                  "キャ=>kya",
                  "キュ=>kyu",
                  "キョ=>kyo",
                  "シャ=>sha",
                  "シュ=>shu",
                  "ショ=>sho",
                  "チャ=>cha",
                  "チュ=>chu",
                  "チョ=>cho",
                  "ニャ=>nya",
                  "ニュ=>nyu",
                  "ニョ=>nyo",
                  "ヒャ=>hya",
                  "ヒュ=>hyu",
                  "ヒョ=>hyo",
                  "ミャ=>mya",
                  "ミュ=>myu",
                  "ミョ=>myo",
                  "リャ=>rya",
                  "リュ=>ryu",
                  "リョ=>ryo",
                  "ファ=>fa",
                  "フィ=>fi",
                  "フェ=>fe",
                  "フォ=>fo",
                  "ギャ=>gya",
                  "ギュ=>gyu",
                  "ギョ=>gyo",
                  "ジャ=>ja",
                  "ジュ=>ju",
                  "ジョ=>jo",
                  "ヂャ=>ja",
                  "ヂュ=>ju",
                  "ヂョ=>jo",
                  "ビャ=>bya",
                  "ビュ=>byu",
                  "ビョ=>byo",
                  "ヴァ=>va",
                  "ヴィ=>vi",
                  "ヴ=>v",
                  "ヴェ=>ve",
                  "ヴォ=>vo",
                  "ァ=>a",
                  "ィ=>i",
                  "ゥ=>u",
                  "ェ=>e",
                  "ォ=>o",
                  "ッ=>t",
                  "ャ=>ya",
                  "ュ=>yu",
                  "ョ=>yo",
                  "ガ=>ga",
                  "ギ=>gi",
                  "グ=>gu",
                  "ゲ=>ge",
                  "ゴ=>go",
                  "ザ=>za",
                  "ジ=>ji",
                  "ズ=>zu",
                  "ゼ=>ze",
                  "ゾ=>zo",
                  "ダ=>da",
                  "ヂ=>ji",
                  "ヅ=>zu",
                  "デ=>de",
                  "ド=>do",
                  "バ=>ba",
                  "ビ=>bi",
                  "ブ=>bu",
                  "ベ=>be",
                  "ボ=>bo",
                  "パ=>pa",
                  "ピ=>pi",
                  "プ=>pu",
                  "ペ=>pe",
                  "ポ=>po",
                  "ア=>a",
                  "イ=>i",
                  "ウ=>u",
                  "エ=>e",
                  "オ=>o",
                  "カ=>ka",
                  "キ=>ki",
                  "ク=>ku",
                  "ケ=>ke",
                  "コ=>ko",
                  "サ=>sa",
                  "シ=>shi",
                  "ス=>su",
                  "セ=>se",
                  "ソ=>so",
                  "タ=>ta",
                  "チ=>chi",
                  "ツ=>tsu",
                  "テ=>te",
                  "ト=>to",
                  "ナ=>na",
                  "ニ=>ni",
                  "ヌ=>nu",
                  "ネ=>ne",
                  "ノ=>no",
                  "ハ=>ha",
                  "ヒ=>hi",
                  "フ=>fu",
                  "ヘ=>he",
                  "ホ=>ho",
                  "マ=>ma",
                  "ミ=>mi",
                  "ム=>mu",
                  "メ=>me",
                  "モ=>mo",
                  "ヤ=>ya",
                  "ユ=>yu",
                  "ヨ=>yo",
                  "ラ=>ra",
                  "リ=>ri",
                  "ル=>ru",
                  "レ=>re",
                  "ロ=>ro",
                  "ワ=>wa",
                  "ヲ=>o",
                  "ン=>n",
                ],
              },
              whitespaces: {
                type: "pattern_replace",
                pattern: "\\s{2,}",
                replacement: "\u0020",
              },
            },
            filter: {
              readingform: {
                type: "kuromoji_readingform",
                use_romaji: true,
              },
              engram: {
                type: "edge_ngram",
                min_gram: 1,
                max_gram: 36,
              },
              maxlength: {
                type: "length",
                max: 36,
              },
            },
            tokenizer: {
              japanese_normal: {
                mode: "normal",
                type: "kuromoji_tokenizer",
              },
            },
          },
        },
        body: {
          mappings: {
            properties: {
              id: { type: "text" },
              title: {
                type: "text",
                analyzer: "keyword_analyzer",
                fields: {
                  readingform: {
                    type: "text",
                    analyzer: "readingform_index_analyzer",
                    search_analyzer: "readingform_search_analyzer",
                  },
                },
              },
              sourceUrl: { type: "text" },
              description: {
                type: "text",
                analyzer: "keyword_analyzer",
                fields: {
                  readingform: {
                    type: "text",
                    analyzer: "readingform_index_analyzer",
                    search_analyzer: "readingform_search_analyzer",
                  },
                },
              },
              totalCookingTime: { type: "long" },
              materials: {
                type: "text",
                analyzer: "keyword_analyzer",
                fields: {
                  readingform: {
                    type: "text",
                    analyzer: "readingform_index_analyzer",
                    search_analyzer: "readingform_search_analyzer",
                  },
                },
              },
              foodImageUrl: { type: "text" },
              dish: { type: "text" },
              category: { type: "text" },
              cuisine: { type: "text" },
            },
          },
        },
      })
      res.status(200).json({ message: `Index "${indexName}" recreated.` })
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
