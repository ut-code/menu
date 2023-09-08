import { Link } from "react-router-dom"
import { Session } from "@supabase/supabase-js"
import styles from "./Hamburger.module.css"

// react-icons
import iconClose from "@/assets/icon/icon_close.svg"
import { BsHouseDoorFill } from "react-icons/bs"
import { BsSearch } from "react-icons/bs"
import { BsHeartFill } from "react-icons/bs"
import { BsGearFill } from "react-icons/bs"
import { FaLock } from "react-icons/fa"

interface Props {
  session: Session | null
  onClickCloseHamburger: () => void
}

export const Hamburger = ({ session, onClickCloseHamburger }: Props) => {
  return (
    <div className="style_lightbrown">
      <div className={styles.top}>
        <button onClick={onClickCloseHamburger} style={{ border: "none" }}>
          <img src={iconClose} alt="icon_close" />
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
        <Link to="/home/favorites" className={styles.link}>
          <BsHeartFill size="1.2rem" />
          <h2>お気に入り</h2>
          {!session && <FaLock size="0.9rem" />}
        </Link>
        <Link to="/home/favorites" className={styles.link}>
          <BsGearFill size="1.2rem" />
          <h2>設定</h2>
        </Link>
      </div>

      {!session && (
        <div className={styles.signin}>
          <div className={styles.signin_text}>
            <div style={{ display: "flex", alignItems: "end", marginBottom: "6px" }}>
              <h2>ゲスト</h2>
              <p style={{ marginLeft: "5px", marginBottom: "2px" }}>さん</p>
            </div>
            <p style={{ color: "gray" }}>メールアドレスの登録なし</p>
          </div>
          <div className={styles.signin_link}>
            <Link to="/auth" className={styles.signin_link_button}>
              <h3>サインイン</h3>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
