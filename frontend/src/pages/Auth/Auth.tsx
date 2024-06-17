import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { UserContext } from "../../utils/context"
import { supabase } from "./supabaseClient"
import { SignOut } from "./SignOut"
import { BorderButton } from "../../components/elements/button/BorderButton"
import { BackButton } from "../../components/elements/button/BackButton"
import { NextButton } from "../../components/elements/button/NextButton"
import { Loading } from "../../components/Loading"
import { TextField } from "@mui/material"

import styles from "./Auth.module.css"

export const Auth = () => {
  const navigate = useNavigate()
  const { session } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [hasAccount, setHasAccount] = useState<boolean>(false)
  const [email, setEmail] = useState("")

  const handleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      alert("Check your email for the login link!")
    }
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
    setLoading(false)
    if (error) {
      alert(error.message)
    }
  }

  if (loading) return <Loading />
  if (session?.access_token) return <SignOut />
  return (
    <div className={styles.root}>
      <BackButton onClick={() => navigate("/setting")} />
      <div className={styles.container}>
        {hasAccount ? (
          <div className={styles.title}>
            <h1>ログイン</h1>
            <h4>ログインに必要な情報を入力してください</h4>
          </div>
        ) : (
          <div className={styles.title}>
            <h1>新規アカウント作成</h1>
            <h4>アカウント作成に必要な情報を入力してください</h4>
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.form}>
            <TextField
              label="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%" }}
            />
            <NextButton
              onClick={() => handleSignIn}
              title={hasAccount ? "ログインする" : "アカウントを作成する"}
              disabled={loading}
            />
          </div>
          <div className={styles.or}>
            <hr />
            <h5>または</h5>
            <hr />
          </div>
          <BorderButton onClick={onClickLoginWithGoogle} disabled={loading}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              // eslint-disable-next-line react/no-unknown-property
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            <h4 style={{ fontSize: 16, fontWeight: "bold", marginLeft: 4 }}>Googleアカウントで続ける</h4>
          </BorderButton>

          {hasAccount ? (
            <div className={styles.orMessage}>
              <h4>アカウントをお持ちでない方は</h4>
              <button onClick={() => setHasAccount(false)} disabled={false}>
                アカウント作成
              </button>
            </div>
          ) : (
            <div className={styles.orMessage}>
              <h4>すでにアカウントをお持ちの方は</h4>
              <button onClick={() => setHasAccount(true)} disabled={false}>
                サインイン
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
