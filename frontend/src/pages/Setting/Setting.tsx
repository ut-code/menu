import { Link } from "react-router-dom"
import styles from "./Setting.module.css"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

export const Setting = () => {
  return (
    <div className={styles.container}>
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
        <Link to={"http://www.goo.ne.jp"} style={{ textDecoration: "none" }}>
          <div className={styles.list}>
            <div className={styles.textarea}>
              <h4 style={{ fontWeight: 400 }}>gooラボAPI</h4>
            </div>
            <img src="//u.xgoo.jp/img/sgoo.png" alt="supported by goo" title="supported by goo" width={"96px"} />
          </div>
        </Link>
      </div>
    </div>
  )
}
