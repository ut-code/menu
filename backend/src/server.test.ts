import request from "supertest"
import server from "./server"

describe("/searchRecipes", () => {
  it("正常系のテスト", async () => {
    const searchInfo = {
      ingredient: ["ごぼう", "豚肉"],
    }

    const response = await request(server).post("/searchRecipes").send({ content: searchInfo }).expect(200)

    expect(response.body).toBeDefined()
    // 他のアサーションやテストを追加することもできる
  })

  server.close()
})
