import { Link } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "@/utils/context"
import styles from "./Setting.module.css"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

export const Setting = () => {
  const { session } = useContext(UserContext)

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.title}>
          <h5>アカウント設定</h5>
        </div>
        <Link to={"/auth"} style={{ textDecoration: "none" }}>
          <div className={styles.list}>
            <div className={styles.textarea}>
              <h4 style={{ fontSize: 16 }}>{session?.access_token ? "ログアウト" : "アカウント作成・ログイン"}</h4>
            </div>
            <ArrowForwardIcon className={styles.icon} />
          </div>
        </Link>
        {/* <Link to={"https://gist.github.com/bvv-1/d3c318f90d0720e81259e58de49adc30"} style={{ textDecoration: "none" }}>
          <div className={styles.list}>
            <div className={styles.textarea}>
              <h4 style={{ fontSize: 16 }}>アカウント削除</h4>
            </div>
            <ArrowForwardIcon className={styles.icon} />
          </div>
        </Link> */}
      </div>
      <div>
        <div className={styles.title}>
          <h5>アプリ情報</h5>
        </div>
        <Link to={"https://gist.github.com/bvv-1/d3c318f90d0720e81259e58de49adc30"} style={{ textDecoration: "none" }}>
          <div className={styles.list}>
            <div className={styles.textarea}>
              <h4 style={{ fontSize: 16 }}>プライバシーポリシー</h4>
              <h5 style={{ color: "#434343" }}>外部リンクに移動します</h5>
            </div>
            <ArrowForwardIcon className={styles.icon} />
          </div>
        </Link>
      </div>
      <div>
        <div className={styles.title}>
          <h5>ライセンス</h5>
        </div>
        <Link to={"http://www.goo.ne.jp"} style={{ textDecoration: "none" }}>
          <div className={styles.list}>
            <div className={styles.textarea}>
              <h4 style={{ fontSize: 16 }}>gooラボAPI</h4>
            </div>
            <img src="//u.xgoo.jp/img/sgoo.png" alt="supported by goo" title="supported by goo" width={"96px"} />
          </div>
        </Link>
      </div>
    </div>
  )
}
