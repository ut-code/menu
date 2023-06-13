import styles from "./QuestionText.module.css"

export const QuestionText = (props: { content: string; userInput: boolean }) => {
  const { content, userInput } = props
  const className = userInput ? styles.big : styles.small

  return (
    <div className={styles.root}>
      <div className={className}>{content}</div>
    </div>
  )
}
