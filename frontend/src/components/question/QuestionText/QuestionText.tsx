import styles from "./QuestionText.module.css"

export const QuestionText = (props: { questionText: string; userInput: boolean }) => {
  const className = props.userInput ? styles.big : styles.small

  return (
    <div className={styles.root}>
      <div className={className}>{props.questionText}</div>
    </div>
  )
}
