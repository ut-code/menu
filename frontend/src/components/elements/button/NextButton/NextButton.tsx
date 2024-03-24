import styles from "./NextButton.module.css"

interface Props {
  onClick?: () => void
  title?: string
}

export const NextButton = ({ onClick, title }: Props) => {
  return (
    <div className={styles.root}>
      <button className={styles.button} onClick={onClick}>
        {title}
      </button>
    </div>
  )
}
