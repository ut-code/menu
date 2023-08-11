import { useState } from "react"
// import { supabase } from "../supabaseClient"

export const DeleteAccount = () => {
  const [loading, setLoading] = useState(false)

  const handleDeleteAccount = async () => {
    setLoading(true)
    // const { error } = await supabase.auth.signOut()

    // if (error) {
    //   alert(error.message)
    // }
    setLoading(false)
  }

  return (
    <button disabled={loading} onClick={handleDeleteAccount}>
      {loading ? <span>Loading</span> : <span>Delete Account</span>}
    </button>
  )
}
