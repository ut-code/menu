import { client } from "../db.server"
import { Request, Response, NextFunction } from "express"
import { supabase } from "../supabaseClient"
import { User } from "@supabase/supabase-js"
import type { Users } from "@prisma/client"

class UserController {
  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userFromRequest = await this.extractUserFromRequest(req)
      if (!userFromRequest) {
        res.status(401).json({ error: "Not authorized" })
        return
      }

      const user = await this.getUserById({ userId: userFromRequest.id })
      if (!user) {
        res.status(404).json({ error: "User not found" })
        return
      }

      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  private async getUserById({ userId }: { userId: Users["id"] }) {
    return client.users.findUnique({
      where: {
        id: userId,
      },
    })
  }

  // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
  private async extractUserFromRequest(req: Request): Promise<User | null> {
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
    return user?.data?.user
  }
}

export default new UserController()
