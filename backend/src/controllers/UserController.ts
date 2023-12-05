import { client } from "../db.server"
import { Request, Response } from "express"
import { supabase } from "../supabaseClient"
import { User } from "@supabase/supabase-js"
import type { Users } from "@prisma/client"

// NOTE: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#use-instance-functions
// メンバ関数にはアロー関数を使っておくと this が undefined にならずに済む
class UserController {
  getUser = async (req: Request, res: Response): Promise<void> => {
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
  }

  updateUsername = async (req: Request, res: Response): Promise<void> => {
    const userFromRequest = await this.extractUserFromRequest(req)
    if (!userFromRequest) {
      res.status(401).json({ error: "Not authorized" })
      return
    }

    const { username } = req.body
    if (!this.isValidUsername(username)) {
      res.status(400).json({ error: "Invalid username" })
      return
    }

    const user = await client.users.update({
      where: {
        id: userFromRequest.id,
      },
      data: {
        username: username,
      },
    })
    if (!user) {
      res.status(500).json({ error: "Failed to update user" })
      return
    }
    res.status(200).json(user)
  }

  private getUserById = async ({ userId }: { userId: Users["id"] }) => {
    return client.users.findUnique({
      where: {
        id: userId,
      },
    })
  }

  // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
  private extractUserFromRequest = async (req: Request): Promise<User | null> => {
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
  }

  private isValidUsername = (username: string): boolean => {
    // TODO: 他のバリデーションも追加する
    return username.length > 0 && username.length <= 20
  }
}

export default new UserController()
