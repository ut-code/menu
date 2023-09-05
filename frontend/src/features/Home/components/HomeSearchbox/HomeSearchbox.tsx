import styles from "./HomeSearchbox.module.css"
import { BsArrowRight } from "react-icons/bs"

export const HomeSearchbox = () => {
  return (
    <div className={styles.search}>
      <label>
        <input className={styles.box} placeholder={"あなたにぴったりのレシピを検索する"} />
      </label>
      <div className={styles.icon}>
        <BsArrowRight size="1rem" color="white" />
      </div>
    </div>
  )
}
