import { Session } from "@supabase/supabase-js"

export type User = {
  id: string | null
  email: string | null
  username: string | null
}

export type UserInfo = {
  user: User | null
  session: Session | null
}
