import styles from "./NextButton.module.css"

interface Props {
  onClick?: () => void
}

export const NextButton = ({ onClick }: Props) => {
  return (
    <div className={styles.root}>
      <button className={styles.button} onClick={onClick}>
        次へ
      </button>
    </div>
  )
}
