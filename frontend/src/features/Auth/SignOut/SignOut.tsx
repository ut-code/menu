import { useState } from "react"
import { supabase } from "../supabaseClient"

export const SignOut = () => {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) alert(error.message)
    setLoading(false)
  }

  return (
    <button disabled={loading} onClick={handleSignOut}>
      {loading ? <span>Loading</span> : <span>Sign out</span>}
    </button>
  )
}
