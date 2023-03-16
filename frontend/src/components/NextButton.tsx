import styles from "@/assets/css/NextButton.module.css"

export default function NextButton(props: { onClick: () => void }) {
  return (
    <div className={styles.nextButton} onClick={() => props.onClick()}>
      Next
    </div>
  )
}
