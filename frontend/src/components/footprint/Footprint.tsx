import styles from "./Footprint.module.css"

// react-icons
import { FaPaw } from "react-icons/fa"

export const Footprint = () => {
  return (
    <>
      <div className={styles.footprint}>
        <FaPaw size="45px" className={styles.left} />
        <FaPaw size="25px" className={styles.right} />
      </div>
    </>
  )
}