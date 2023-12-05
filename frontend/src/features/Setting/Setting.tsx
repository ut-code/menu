import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { updateUsernameApi } from "@/utils/apiUtils"
import { User } from "@/utils/users"
import { UserContext } from "@/utils/context"
import { BorderButton } from "@/components/elements/button/BorderButton"
import { Head } from "@/components/Head"
import { Hamburger } from "@/components/Hamburger"
import styles from "./Setting.module.css"

import { BsArrowRight } from "react-icons/bs"

interface Props {
  setUser: (user: User | null) => void
}

export const Setting = ({ setUser }: Props) => {
  const Navigate = useNavigate()
  const { user, session } = useContext(UserContext)

  // const [email, setEmail] = useState(user?.email || "")
  const [username, setUsername] = useState(user?.username || "")
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)

  const updateUsername = async () => {
    if (!session?.access_token || !user) return
    const response = await fetch(updateUsernameApi(), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ username: username }),
    })
    console.log(response)
    if (!response.ok) throw new Error("ユーザーネームの更新に失敗しました")

    setUser({ ...user, username: username })
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isOpenHamburger) return <Hamburger onClickCloseHamburger={onClickCloseHamburger} />
  return (
    <div className="style_lightbrown">
      <Head
        showBackButton={true}
        onClickPreviousPage={() => Navigate("/home")}
        onClickOpenHamburger={onClickOpenHamburger}
      />

      <h2 style={{ margin: "20px 0" }}>設定</h2>

      {user && (
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

          <BorderButton onClick={async () => await updateUsername()} disabled={false}>
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
