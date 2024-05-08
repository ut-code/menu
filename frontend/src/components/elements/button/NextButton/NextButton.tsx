import styles from "./NextButton.module.css"

interface Props {
  onClick?: () => void
  title?: string
  disabled?: boolean
}

export const NextButton = ({ onClick, title, disabled }: Props) => {
  return (
    <div className={styles.root}>
      <button className={styles.button} onClick={onClick} disabled={disabled}>
        {title}
      </button>
    </div>
  )
}
