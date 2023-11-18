import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Session } from "@supabase/supabase-js"

import { BorderButton } from "@/components/elements/button/BorderButton"
import { Head } from "@/components/Head"
import { Hamburger } from "@/components/Hamburger"
import styles from "./Setting.module.css"

interface Props {
  session: Session | null
}

export const Setting = ({ session }: Props) => {
  const Navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [hasAccount, setHasAccount] = useState<boolean>(true)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)

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

      {hasAccount && (
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

          <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <span className={styles.label}>
              <h3>メールアドレス</h3>
            </span>
            <input
              type="email"
              disabled={true}
              // NOTE: 本人がemailを変更しているか、変更後のemailがvalidか確認する処理を含めて実装する必要があり、一旦後回しにするためdisabled
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          <div style={{ height: "40px" }} />

          <BorderButton onClick={/* TODO */ () => console.log("TODO")} disabled={loading}>
            <h3>アカウント情報を変更する</h3>
          </BorderButton>
        </form>
      )}

      {/* TODO: プライバシーポリシー */}
    </div>
  )
}
