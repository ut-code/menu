import { Link } from "react-router-dom"
import styles from "./Hamburger.module.css"

interface Props {
  onClickClose: () => void
}

export const Hamburger = (props: Props) => {
  return (
    <>
      <div className={styles.overlay}>
        {/* react-iconsの置き換えは任せた！ */}
        <button onClick={props.onClickClose} className={styles.close}>
          x
        </button>
        <div className={styles.content}>
          <Link to={"/home"}>ホーム</Link>
          <Link to={"/questions"}>検索する</Link>
          <Link to={"/"}>このアプリの使い方</Link>
          <Link to={"/home"}>設定</Link>
          <button>English</button>
          ©だるめし Dull Meshi
        </div>
      </div>
    </>
  )
}
