import styles from "./Loading.module.css"

export const Loading = () => {
  return (
    <div className={styles.root}>
      <div className={styles.loader}></div>
      <h3 className={styles.text}>読み込み中</h3>
    </div>
  )
}
