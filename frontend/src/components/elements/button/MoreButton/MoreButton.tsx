import styles from "./MoreButton.module.css"

interface Props {
  onClick?: () => void
}

export const MoreButton = ({ onClick }: Props) => {
  return (
    <div className={styles.root}>
      <button className={styles.button} onClick={onClick}>
        もっと見る
      </button>
    </div>
  )
}
