import { useState, useEffect } from "react"

import { supabase } from "./supabaseClient"
import { BorderButton } from "@/components/elements/button/BorderButton"
import { BackButton } from "@/components/elements/button/BackButton"
import { NextButton } from "@/components/elements/button/NextButton"
import { Loading } from "@/components/Loading"
import { Setting } from "../Setting"

import styles from "./Auth.module.css"

interface Props {
  inputUsername: string | undefined
  setInputUsername: (inputUsername: string) => void
}

export const Auth = ({ setInputUsername }: Props) => {
  const [loading, setLoading] = useState(false)
  const [hasAccount, setHasAccount] = useState<boolean>(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    setInputUsername("")
  }, [])

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
  return (
    <div className={styles.root}>
      <BackButton onClick={() => Setting} />
      <div className={styles.container}>
        {hasAccount ? (
          <div className={styles.title}>
            <h1>ログイン</h1>
            <h6>ログインに必要な情報を入力してください</h6>
          </div>
        ) : (
          <div className={styles.title}>
            <h1>新規アカウント作成</h1>
            <h6>アカウント作成に必要な情報を入力してください</h6>
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.form}>
            <div>
              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>
            <NextButton
              onClick={() => handleSignIn}
              title={hasAccount ? "ログインする" : "アカウントを作成する"}
              disabled={loading}
            />
          </div>
          <div className={styles.or}>
            <hr />
            <h6>または</h6>
            <hr />
          </div>
          <BorderButton onClick={onClickLoginWithGoogle} disabled={loading}>
            Googleアカウントで続ける
          </BorderButton>

          {!hasAccount && (
            <div className={styles.orMessage}>
              <h6>すでにアカウントをお持ちの方は</h6>
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
