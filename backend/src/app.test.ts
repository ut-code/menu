import request from "supertest"
import app from "./app"

// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
describe("/searchRecipes", () => {
  it("正常系のテスト", async () => {
    const searchInfo = {
      ingredients: ["ごぼう", "豚肉"],
      cookingTime: null,
      dish: null,
    }

    const response = await request(app).post("/api/searchRecipes").send({ searchInfo: searchInfo })
    expect(response.statusCode).toBe(200)
  })
})
