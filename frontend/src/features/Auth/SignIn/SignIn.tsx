import { useState } from "react"
import { supabase } from "../supabaseClient"

export const SignIn = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.message)
    } else {
      alert("Check your email for the login link!")
    }
    setLoading(false)
  }

  const onClickLoginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })
    if (error) {
      alert(error.message)
    }
  }

  return (
    <>
      <h1>ログイン</h1>
      <p>Sign in via magic link with your email below</p>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={loading}>{loading ? <span>Loading</span> : <span>Send magic link</span>}</button>
      </form>
      <p>or</p>
      <button onClick={onClickLoginWithGoogle}>Sign in with Google Account</button>
    </>
  )
}
