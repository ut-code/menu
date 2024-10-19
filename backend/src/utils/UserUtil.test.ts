import { Request } from "express"
import { extractUserFromRequest } from "./UserUtil"
import { supabase } from "../supabaseClient"
import { User } from "@supabase/supabase-js"

jest.mock("../supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}))

describe("extractUserFromRequest", () => {
  let req: Partial<Request>

  beforeEach(() => {
    req = {
      headers: {},
    }
  })

  beforeAll(() => {
    // Suppress console.error
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  it("should return null if no authorization header is present", async () => {
    const user = await extractUserFromRequest(req as Request)
    expect(user).toBeNull()
  })

  it("should return null if the authorization header is malformed", async () => {
    req.headers = req.headers || {}
    req.headers["authorization"] = "InvalidToken"
    const user = await extractUserFromRequest(req as Request)
    expect(user).toBeNull()
  })

  it("should return null if Supabase returns no user", async () => {
    req.headers = req.headers || {}
    req.headers["authorization"] = "Bearer validToken"
    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: null })

    const user = await extractUserFromRequest(req as Request)
    expect(user).toBeNull()
  })

  it("should return the user if the token is valid and Supabase returns a user", async () => {
    const mockUser: User = { id: "123", email: "test@example.com" } as User
    req.headers = req.headers || {}
    req.headers["authorization"] = "Bearer validToken"
    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser } })

    const user = await extractUserFromRequest(req as Request)
    expect(user).toEqual(mockUser)
  })

  it("should handle errors and return null", async () => {
    req.headers = req.headers || {}
    req.headers["authorization"] = "Bearer validToken"
    ;(supabase.auth.getUser as jest.Mock).mockRejectedValue(new Error("Some error"))

    const user = await extractUserFromRequest(req as Request)
    expect(user).toBeNull()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
