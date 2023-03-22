import { BsArrowLeft } from "react-icons/bs"
import styles from "./BackButton.module.css"

export default function BackButton(props: { onClick: () => void }) {
  return (
    <div className={styles.button} onClick={() => props.onClick()}>
      <BsArrowLeft size="1.2rem" color="var(--Black)" />
    </div>
  )
}
