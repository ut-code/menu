import { Session } from "@supabase/supabase-js"

export type User = {
  id: string | null
  name: string | null
  email: string | null
}

export type UserInfo = {
  user: User | null
  session: Session | null
}
