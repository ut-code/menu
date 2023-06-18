import { BsArrowLeft } from "react-icons/bs"
import styles from "./BackButton.module.css"

export const BackButton = (props: { onClick: () => void }) => {
  return (
    <div className={styles.button} onClick={() => props.onClick()}>
      <BsArrowLeft size="1.2rem" color="white" />
    </div>
  )
}
