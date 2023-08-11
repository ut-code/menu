import { useState } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "../supabaseClient"

interface Props {
  session: Session | null
}

export const DeleteAccount = (props: Props) => {
  const [loading, setLoading] = useState(false)

  const handleDeleteAccount = async () => {
    setLoading(true)
    const userId = props.session?.user?.id
    if (!userId) return

    const [deleteResult, signOutResult] = await Promise.all([
      supabase.from("Users").delete().eq("id", userId),
      supabase.auth.signOut(),
    ])
    if (deleteResult.error) alert(deleteResult.error.message)
    if (signOutResult.error) alert(signOutResult.error.message)

    setLoading(false)
  }

  return (
    <button disabled={loading} onClick={handleDeleteAccount}>
      {loading ? <span>Loading</span> : <span>Delete Account</span>}
    </button>
  )
}
