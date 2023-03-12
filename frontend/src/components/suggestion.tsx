import styles from "@/assets/css/suggestion.module.css"

export default function Suggestion(props: { ingridientName: string; ingridientImage: string }) {
  return (
    <div className={styles.suggestion} style={{ backgroundImage: `url(${props.ingridientImage})` }}>
      <div className={styles.heading}>{props.ingridientName}</div>
    </div>
  )
}
