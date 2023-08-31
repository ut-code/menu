import request from "supertest"
import app, { SearchInfo } from "./app"

// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
describe("/searchRecipes", () => {
  it("正常系のテスト", async () => {
    const searchInfo: SearchInfo = {
      ingredients: ["ごぼう", "豚肉"],
      // time: "",
      // dish: "",
      // keywords: [],
    }

    const response = await request(app).post("/api/searchRecipes").send({ content: searchInfo })
    expect(response.statusCode).toBe(200)
  })
})
