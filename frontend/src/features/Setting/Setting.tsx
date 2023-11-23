import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Session } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"

import { getUsernameApi, updateUsernameApi } from "@/utils/apiUtils"
import { BorderButton } from "@/components/elements/button/BorderButton"
import { Head } from "@/components/Head"
import { Hamburger } from "@/components/Hamburger"
import styles from "./Setting.module.css"

import { BsArrowRight } from "react-icons/bs"

interface Props {
  session: Session | null
}

export const Setting = ({ session }: Props) => {
  const Navigate = useNavigate()

  // const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)

  const { isLoading, refetch: refetchUsername } = useQuery({
    queryKey: ["username"],
    queryFn: async () => {
      if (!session?.access_token) return ""
      const response = await fetch(getUsernameApi(), {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) throw new Error("ユーザーネームの取得に失敗しました")
      return await response.json()
    },
    onSuccess: (data) => {
      setUsername(data)
    },
  })

  const updateUsername = async (session: Session | null) => {
    console.log(session)
    if (!session?.access_token) return
    const response = await fetch(updateUsernameApi(), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ username: username }),
    })
    console.log(response)
    if (!response.ok) throw new Error("ユーザーネームの更新に失敗しました")

    refetchUsername()
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isOpenHamburger) return <Hamburger session={session} onClickCloseHamburger={onClickCloseHamburger} />
  return (
    <div className="style_lightbrown">
      <Head
        showBackButton={true}
        onClickPreviousPage={() => Navigate("/home")}
        onClickOpenHamburger={onClickOpenHamburger}
      />

      <h2 style={{ margin: "20px 0" }}>設定</h2>

      {session && (
        <form className={styles.form}>
          <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <span className={styles.label}>
              <h3>ユーザーネーム</h3>
            </span>
            <input
              type="text"
              placeholder="ユーザーネームを入力してください"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
          </div>

          <div style={{ height: "12px" }} />

          {/* NOTE: 本人がemailを変更しているか、変更後のemailがvalidか確認する処理を含めて実装する必要があり、一旦後回しにした */}
          {/* <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <span className={styles.label}>
              <h3>メールアドレス</h3>
            </span>
            <input
              type="email"
              placeholder="メールアドレスを入力してください"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div> */}

          <div style={{ height: "40px" }} />

          <BorderButton onClick={async () => await updateUsername(session)} disabled={isLoading}>
            <h3>アカウント情報を変更する</h3>
          </BorderButton>
        </form>
      )}

      <Link to={"https://gist.github.com/bvv-1/d3c318f90d0720e81259e58de49adc30"} className={styles.signin}>
        <div className={styles.signin_text}>
          <div style={{ display: "flex", alignItems: "end", marginBottom: "6px" }}>
            <h2>プライバシーポリシー</h2>
          </div>
          <p style={{ color: "gray" }}>外部リンクに移動します。</p>
        </div>
        <div className={styles.signin_link}>
          <div className={styles.arrow_right}>
            <BsArrowRight size="2rem" color="white" />
          </div>
        </div>
      </Link>
    </div>
  )
}
