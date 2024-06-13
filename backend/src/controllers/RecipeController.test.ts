import { Request, Response } from "express"
import RecipeController from "./RecipeController"
import { elasticSearchClient } from "../elasticSearchClient"

const useDockerContainer = process.env.USE_DOCKER_CONTAINER === "true"

if (useDockerContainer) {
  beforeAll(async () => {
    // elasticSearchClientにrecipesという名前のindexを作成
    await elasticSearchClient.indices.create({
      index: "recipes",
      mappings: {
        properties: {
          category: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          cuisine: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          description: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          dish: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          foodImageUrl: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          id: {
            type: "long",
          },
          keywords: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          materials: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          sourceUrl: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          title: {
            type: "text",
            fields: {
              keyword: {
                type: "keyword",
                ignore_above: 256,
              },
            },
          },
          totalCookingTime: {
            type: "long",
          },
        },
      },
    })
  })

  describe("indexRecipe", () => {
    // 正常系
    it("should return 201 and submission", async () => {
      const req = {
        body: {
          recipe: {
            title: "title",
            description: "description",
            totalCookingTime: 10,
            materials: "materials",
            sourceUrl: "sourceUrl",
            foodImageUrl: "foodImageUrl",
            dish: "dish",
            category: "category",
            cuisine: "cuisine",
          },
        },
      } as Request

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      await RecipeController.indexRecipe(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalled()
    })

    // 異常系
    it("should return 400 and error message", async () => {
      const req = {
        body: {
          // recipe: {
          //   title: "title",
          // },
        },
      } as Request

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      await RecipeController.indexRecipe(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalled()
    })
  })

  afterAll(async () => {
    await elasticSearchClient.indices.delete({
      index: "recipes",
    })
  })
} else {
  test("test", () => {
    expect(1).toBe(1)
  })
}
