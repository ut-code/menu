import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { supabase } from "./supabaseClient"
import { BorderButton } from "@/components/elements/button/BorderButton"
import { Head } from "@/components/Head"
import { Hamburger } from "@/components/Hamburger"
import styles from "./Auth.module.css"

export const Auth = () => {
  const Navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)

  const handleSignIn = async () => {
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
    setLoading(true)
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
    setLoading(false)
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  return (
    <div className="style_lightbrown">
      <Head
        showBackButton={true}
        onClickPreviousPage={() => Navigate("/home")}
        onClickOpenHamburger={onClickOpenHamburger}
      />
      {isOpenHamburger === true && <Hamburger onClickCloseHamburger={onClickCloseHamburger} />}

      <h1 className={styles.title}>サインイン</h1>
      <form className={styles.form}>
        <span className={styles.label}>メールアドレス</span>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <div style={{ height: "40px" }} />
        <BorderButton onClick={handleSignIn} disabled={loading}>
          サインイン
        </BorderButton>
      </form>
      <div className={styles.or}>or</div>
      <BorderButton onClick={onClickLoginWithGoogle} disabled={loading}>
        Googleアカウントで続ける
      </BorderButton>
    </div>
  )
}
