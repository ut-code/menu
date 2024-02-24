import { useContext } from "react"
import { Link } from "react-router-dom"

import { SignOut } from "@/features/Auth/SignOut"
import { UserContext } from "@/utils/context"
import styles from "./Hamburger.module.css"
// react-icons
import iconClose from "@/assets/icon/icon_close.svg"
import { BsHouseDoorFill, BsSearch, BsHeartFill, BsGearFill } from "react-icons/bs"
import { FaLock } from "react-icons/fa"

interface Props {
  onClickCloseHamburger: () => void
}

export const Hamburger = ({ onClickCloseHamburger }: Props) => {
  const { user, session } = useContext(UserContext)

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
        {session ? (
          <Link to="/home/favorites" className={styles.link}>
            <BsHeartFill size="1.2rem" />
            <h2>お気に入り</h2>
          </Link>
        ) : (
          <div className={styles.link}>
            <BsHeartFill size="1.2rem" />
            <h2>お気に入り</h2>
            <FaLock size="0.9rem" />
          </div>
        )}
        <Link to="/setting" className={styles.link}>
          <BsGearFill size="1.2rem" />
          <h2>設定</h2>
        </Link>
      </div>

      <div className={styles.signin}>
        <div className={styles.signin_text}>
          <div style={{ display: "flex", alignItems: "end", marginBottom: "6px" }}>
            <h2>{session ? user?.username : "ゲスト"}</h2>
            <p style={{ marginLeft: "5px", marginBottom: "2px" }}>さん</p>
          </div>
          {!session && <p style={{ color: "gray" }}>メールアドレスの登録なし</p>}
        </div>
        <div className={styles.signin_link}>
          {!session ? (
            <Link to="/auth" className={styles.signin_link_button}>
              <h3>サインイン</h3>
            </Link>
          ) : (
            <div className={styles.signin_link_button}>
              <SignOut />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
