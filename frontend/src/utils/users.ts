import { Session } from "@supabase/supabase-js"

export type User = {
  id: string
  email: string
}

export type UserInfo = {
  user: User | null
  session: Session | null
}
