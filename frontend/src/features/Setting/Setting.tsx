import { Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react"

import { User, updateUsername } from "@/utils/users"
import { UserContext } from "@/utils/context"
import { BorderButton } from "@/components/elements/button/BorderButton"
import styles from "./Setting.module.css"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

interface Props {
  setUser: (user: User | null) => void
  setInputUsername: (inputUsername: string) => void
}

export const Setting = ({ setUser, setInputUsername }: Props) => {
  const { user, session } = useContext(UserContext)

  // const [email, setEmail] = useState(user?.email || "")
  const [username, setUsername] = useState(user?.username || "")

  useEffect(() => {
    setInputUsername("")
  }, [])

  const handleUpdateUsername = async () => {
    const updatedUsername = await updateUsername({ user, session }, username)
    if (updatedUsername && user) {
      setUser({ ...user, username: updatedUsername })
    }
  }

  return (
    <div className={styles.container}>
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
              maxLength={20}
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

          <BorderButton onClick={async () => await handleUpdateUsername()} disabled={false}>
            <h3>アカウント情報を変更する</h3>
          </BorderButton>
        </form>
      )}
      <div>
        <div className={styles.title}>
          <h6>アカウント設定</h6>
        </div>
        <Link to={"https://gist.github.com/bvv-1/d3c318f90d0720e81259e58de49adc30"} style={{ textDecoration: "none" }}>
          <div className={styles.list}>
            <div className={styles.textarea}>
              <h4 style={{ fontWeight: 400 }}>ログアウト</h4>
            </div>
            <ArrowForwardIcon className={styles.icon} />
          </div>
        </Link>
        <Link to={"https://gist.github.com/bvv-1/d3c318f90d0720e81259e58de49adc30"} style={{ textDecoration: "none" }}>
          <div className={styles.list}>
            <div className={styles.textarea}>
              <h4 style={{ fontWeight: 400 }}>アカウント削除</h4>
            </div>
            <ArrowForwardIcon className={styles.icon} />
          </div>
        </Link>
      </div>
      <div>
        <div className={styles.title}>
          <h6>アプリ情報</h6>
        </div>
        <Link to={"https://gist.github.com/bvv-1/d3c318f90d0720e81259e58de49adc30"} style={{ textDecoration: "none" }}>
          <div className={styles.list}>
            <div className={styles.textarea}>
              <h4 style={{ fontWeight: 400 }}>プライバシーポリシー</h4>
              <h6 style={{ color: "#434343" }}>外部リンクに移動します</h6>
            </div>
            <ArrowForwardIcon className={styles.icon} />
          </div>
        </Link>
      </div>
      <div>
        <div className={styles.title}>
          <h6>ライセンス</h6>
        </div>
        <Link to={"https://gist.github.com/bvv-1/d3c318f90d0720e81259e58de49adc30"} style={{ textDecoration: "none" }}>
          <div className={styles.list}>
            <div className={styles.textarea}>
              <h4 style={{ fontWeight: 400 }}>gooラボAPI</h4>
            </div>
            <a href="http://www.goo.ne.jp/">
              <img src="//u.xgoo.jp/img/sgoo.png" alt="supported by goo" title="supported by goo" width={"96px"} />
            </a>
          </div>
        </Link>
      </div>
    </div>
  )
}
