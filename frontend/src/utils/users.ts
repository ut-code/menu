import { Session } from "@supabase/supabase-js"

import { updateUsernameApi } from "./apiUtils"

export type User = {
  id: string | null
  email: string | null
  username: string | null
}

export type UserInfo = {
  user: User | null
  session: Session | null
}

export const updateUsername = async (
  { user, session }: UserInfo,
  username: string | undefined
): Promise<string | null> => {
  if (!session?.access_token || !user) return null
  if (!username) return null

  const response = await fetch(updateUsernameApi(), {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
    body: JSON.stringify({ username: username }),
  })
  if (!response.ok) {
    alert("ユーザーネームの更新に失敗しました")
    return null
  }
  return username
}
