import { Link } from "react-router-dom"
import styles from "./Hamburger.module.css"

// react-icons
import { CgClose } from "react-icons/cg"
import { BsHouseDoorFill } from "react-icons/bs"
import { BsSearch } from "react-icons/bs"
import { BsQuestionLg } from "react-icons/bs"
import { BsGearFill } from "react-icons/bs"

// components
import { Footprint } from "@/components/elements/footprint/Footprint"

interface Props {
  onClickCloseHamburger: () => void
}

export const Hamburger = (props: Props) => {
  return (
    <>
      <div className={styles.overlay}>
        <button onClick={props.onClickCloseHamburger} className={styles.close}>
          <CgClose size="1.2rem" />
        </button>
        <div className={styles.content}>
          <div className={styles.links}>
            <Link to={"/home"} className={styles.link}>
              <BsHouseDoorFill />
              <p>ホーム</p>
            </Link>
            <Link to={"/questions"} className={styles.link}>
              <BsSearch />
              <p>検索する</p>
            </Link>
            <Link to={"/"} className={styles.link}>
              <BsQuestionLg />
              <p>このアプリの使い方</p>
            </Link>
            <Link to={"/home"} className={styles.link}>
              <BsGearFill />
              <p>設定</p>
            </Link>
          </div>
          <button className={styles.language}>English</button>

          <Footprint />

          <div className={styles.footer}>©だるめし Dull Meshi</div>
        </div>
      </div>
    </>
  )
}
