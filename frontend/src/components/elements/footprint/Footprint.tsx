import styles from "./Footprint.module.css"

// react-icons
import { FaPaw } from "react-icons/fa"

export const Footprint = (props) => {
  const ratio = props
  return (
    <>
      <div className={styles.footprint}>
        <FaPaw size="${45*ratio}px" className={styles.left} />
        <FaPaw size="${25*ratio}px" className={styles.right} />
      </div>
    </>
  )
}
