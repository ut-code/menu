import styles from "./Keywords.module.css"
interface Props {
  keywords: (string | undefined)[]
}

export const Keywords = ({ keywords }: Props) => {
  return (
    <div className={styles.box}>
      <span className={styles.title}>あなたの検索ワード🔍&nbsp;&nbsp;</span>
      <br></br>
      <div className={styles.text}>{keywords.join(" ")}</div>
    </div>
  )
}
