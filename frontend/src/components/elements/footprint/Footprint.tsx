// react-icons
import { FaPaw } from "react-icons/fa"
import styles from "./Footprint.module.css"

type FootPrintProps = {
  ratio: number
}

export const Footprint = (props: FootPrintProps) => {
  return (
    <>
      <div className={styles.footprint}>
        <FaPaw size="45px" className={styles.left} />
        <FaPaw size="25px" className={styles.right} />
      </div>
    </>
  )
}
