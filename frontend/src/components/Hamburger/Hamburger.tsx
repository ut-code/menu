import { Link } from "react-router-dom"
import styles from "./Hamburger.module.css"

// react-icons
import { CgClose } from "react-icons/cg"
import { BsHouseDoorFill } from "react-icons/bs"
import { BsSearch } from "react-icons/bs"
import { BsHeartFill } from "react-icons/bs"
import { BsGearFill } from "react-icons/bs"

interface Props {
  onClickCloseHamburger: () => void
}

export const Hamburger = (props: Props) => {
  return (
    <div className="style_lightbrown">
      <div className={styles.top}>
        <button onClick={props.onClickCloseHamburger} className={styles.close}>
          <CgClose size="1.2rem" />
        </button>
      </div>
      <div className={styles.links}>
        <Link to="/home" className={styles.link}>
          <BsHouseDoorFill size="1.2rem" />
          <h2>ホーム</h2>
        </Link>
        <Link to="/questions" className={styles.link}>
          <BsSearch size="1.2rem" />
          <h2>検索する</h2>
        </Link>
        <Link to="/favorite" className={styles.link}>
          <BsHeartFill size="1.2rem" />
          <h2>お気に入り</h2>
        </Link>
        <Link to="/favorite" className={styles.link}>
          <BsGearFill size="1.2rem" />
          <h2>設定</h2>
        </Link>
      </div>
      <div className={styles.signin}>
        <div className={styles.signin_text}>
          <h2>ゲスト</h2>
          <p>さん</p>
          <p>メールアドレスの登録なし</p>
        </div>
        <Link to="/auth" className={styles.signin_link}>
          <h3>サインイン</h3>
        </Link>
      </div>
    </div>
  )
}
