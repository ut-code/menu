import { Link } from "react-router-dom"
import styles from "./Hamburger.module.css"

// react-iconを入れる（仮置き）
// react-iconsの置き換えは任せた！
import { FaBars } from "react-icons/fa"

interface Props {
  onClickCloseHamburger: () => void
}

export const Hamburger = (props: Props) => {
  return (
    <>
      <div className={styles.overlay}>
        <button onClick={props.onClickCloseHamburger} className={styles.close}>
          x
        </button>
        <div className={styles.content}>
          <div className={styles.links}>
            <Link to={"/home"} className={styles.link}>
              <FaBars />
              ホーム
            </Link>
            <Link to={"/questions"} className={styles.link}>
              <FaBars />
              検索する
            </Link>
            <Link to={"/"} className={styles.link}>
              <FaBars />
              このアプリの使い方
            </Link>
            <Link to={"/home"} className={styles.link}>
              <FaBars />
              設定
            </Link>
          </div>
          <button className={styles.language}>English</button>
          <div className={styles.footer}>©だるめし Dull Meshi</div>
        </div>
      </div>
    </>
  )
}
