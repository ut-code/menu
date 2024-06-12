import request from "supertest"
import app from "./app"

// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
describe("GET /", () => {
  it("should return 200 OK", async () => {
    const response = await request(app).get("/")
    expect(response.status).toBe(200)
  })
})
