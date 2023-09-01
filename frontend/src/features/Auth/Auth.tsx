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
  const [hasAccount, setHasAccount] = useState<boolean>(false)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
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
      {hasAccount ? (
        <Head
          showBackButton={true}
          onClickPreviousPage={() => setHasAccount(false)}
          onClickOpenHamburger={onClickOpenHamburger}
        />
      ) : (
        <Head
          showBackButton={true}
          onClickPreviousPage={() => Navigate("/home")}
          onClickOpenHamburger={onClickOpenHamburger}
        />
      )}
      {isOpenHamburger === true && <Hamburger onClickCloseHamburger={onClickCloseHamburger} />}

      {hasAccount ? <h1 className={styles.title}>サインイン</h1> : <h1 className={styles.title}>サインアップ</h1>}
      <form className={styles.form}>
        {!hasAccount && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <span className={styles.label}>ユーザーネーム</span>
            <input
              type="text"
              placeholder="ユーザーネームを入力してください"
              value={username}
              required={true}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
          </div>
        )}
        <div style={{ height: "12px" }} />

        <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <span className={styles.label}>メールアドレス</span>
          <input
            type="email"
            placeholder="メールアドレスを入力してください"
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>
        <div style={{ height: "40px" }} />
        <BorderButton onClick={handleSignIn} disabled={loading}>
          {hasAccount ? "サインイン" : "サインアップ"}
        </BorderButton>
      </form>
      <div className={styles.or}>or</div>
      <BorderButton onClick={onClickLoginWithGoogle} disabled={loading}>
        Googleアカウントで続ける
      </BorderButton>

      <div style={{ height: "60px" }} />

      {!hasAccount && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span className={styles.labelCenter}>すでにサインアップがお済みの方は</span>
          <BorderButton onClick={() => setHasAccount(true)} disabled={false} isWhite={true}>
            サインイン
          </BorderButton>
        </div>
      )}
    </div>
  )
}
