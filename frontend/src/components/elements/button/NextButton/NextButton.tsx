import styles from "./NextButton.module.css"

export const NextButton = (props: { onClick: () => void }) => {
  return (
    <div className={styles.button} onClick={() => props.onClick()}>
      Next
    </div>
  )
}
