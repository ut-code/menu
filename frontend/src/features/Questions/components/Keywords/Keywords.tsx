import styles from "./Keywords.module.css"

type Answer = {
  answerNumber: number
  content: string
}

export const Keywords = (props: { answers: Answer[] }) => {
  return (
    <div className={styles.box}>
      <span className={styles.title}>あなたの検索ワード🔍&nbsp;&nbsp;</span>
      <br></br>
      <div className={styles.text}>
        {props.answers.map((answer, index) => (
          <span key={index}>{answer.content}&nbsp;</span>
        ))}
      </div>
    </div>
  )
}
