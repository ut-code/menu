import { Link } from "react-router-dom"
import styles from "./Hamburger.module.css"

interface Props {
  onClickClose: () => void
}

export const Hamburger = (props: Props) => {
  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <button onClick={props.onClickClose}>閉じる</button>
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
