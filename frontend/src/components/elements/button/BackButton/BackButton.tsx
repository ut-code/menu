import { BsArrowLeft } from "react-icons/bs"
import styles from "./BackButton.module.css"

export const BackButton = (props: { onClick: () => void }) => {
  return (
    <div className={styles.button} onClick={() => props.onClick()}>
      <div className={styles.button2}>
        <BsArrowLeft size="24px" />
      </div>
    </div>
  )
}
