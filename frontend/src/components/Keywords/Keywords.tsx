import styles from "./Keywords.module.css"

type Answer = {
  answerNumber: number
  content: string
}

export default function Keywords(props: { answers: Answer[] }) {
  return (
    <div className={styles.box}>
      <span className={styles.title}>Keywords&nbsp;&nbsp;</span>
      <br></br>
      <div className={styles.text}>
        {props.answers.map((answer, index) => (
          <span key={index}>{answer.content}&nbsp;</span>
        ))}
      </div>
    </div>
  )
}
