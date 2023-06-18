import { Link } from "react-router-dom"
import styles from "./Hamburger.module.css"

export const Hamburger = () => {
  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <Link to={"/home"}>
            <button>ホーム</button>
          </Link>
          <Link to={"/questions"}>
            <button>検索する</button>
          </Link>
          <Link to={"/"}>
            <button>このアプリの使い方</button>
          </Link>
          <Link to={"/home"}>
            <button>設定</button>
          </Link>
          <button>English</button>
          だるめし Dull Meshi
        </div>
      </div>
    </>
  )
}
