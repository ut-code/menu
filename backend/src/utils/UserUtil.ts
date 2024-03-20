import { Request } from "express"
import { supabase } from "../supabaseClient"
import { User } from "@supabase/supabase-js"

// NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
export async function extractUserFromRequest(req: Request): Promise<User | null> {
  try {
    const authorizationHeader = req.headers["authorization"]
    if (!authorizationHeader) {
      return null
    }
    const tokenMatch = authorizationHeader.match(/^Bearer (.+)$/)
    if (!tokenMatch || tokenMatch.length !== 2) {
      return null
    }
    const token = tokenMatch[1]

    const user = await supabase.auth.getUser(token)
    if (!user) {
      return null
    }
    return user.data.user
  } catch (error) {
    console.error("Error in extractUserFromRequest:", error)
    return null
  }
}
