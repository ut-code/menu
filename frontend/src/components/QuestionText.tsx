import styles from "@/assets/css/QuestionText.module.css"

export default function QuestionText(props: { content: string; userInput: boolean }) {
  const { content, userInput } = props
  const className = userInput ? styles.big : styles.small

  return (
    <div className={styles.root}>
      <div className={className}>{content}</div>
    </div>
  )
}
