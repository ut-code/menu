import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import styles from "./BackButton.module.css"

export const BackButton = (props: { onClick: () => void }) => {
  return (
    <div className={styles.button} onClick={() => props.onClick()}>
      <div className={styles.button2}>
        <ArrowBackIcon />
      </div>
    </div>
  )
}
