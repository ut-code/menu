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
        <FaPaw size={`${props.ratio * 45}px`} className={styles.left} />
        <FaPaw size={`${props.ratio * 25}px`} className={styles.right} />
      </div>
    </>
  )
}
