import styles from "./HomeSearchbox.module.css"
import { FiSearch } from "react-icons/fi"

export const HomeSearchbox = () => {
  return (
    <div className={styles.search}>
      <input
        className={styles.box}
        // type="text"
        placeholder={"あなたにぴったりのレシピを検索する"}
        // value={props.inputContent}
        // onChange={props.onChange}
      />
      <div>
        <FiSearch className={styles.icon} />
      </div>
    </div>
  )
}
