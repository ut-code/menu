import { createContext } from "react"
import { UserInfo } from "./users"

// Ref: https://mixblog.vercel.app/contents/next-supabase
export const UserContext = createContext({ user: null, session: null } as UserInfo)
