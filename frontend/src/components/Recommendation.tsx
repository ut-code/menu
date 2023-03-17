import styles from "@/assets/css/Recommendation.module.css"

export default function Recommendation(props: { ingredientName: string; ingredientImage: string }) {
  return (
    <div className={styles.box}>
      <img className={styles.iframe} src={props.ingredientImage} />
      <div className={styles.heading}>{props.ingredientName}</div>
    </div>
  )
}
