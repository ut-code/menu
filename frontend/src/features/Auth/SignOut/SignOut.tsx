import { supabase } from "../supabaseClient"

export const SignOut = () => {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) alert(error.message)
  }

  return (
    <button onClick={handleSignOut} style={{ border: "none", background: "transparent" }}>
      <span>サインアウト</span>
    </button>
  )
}
