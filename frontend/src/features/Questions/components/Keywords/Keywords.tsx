import styles from "./Keywords.module.css"
import footprint from "../../../../assets/image/footprint.svg"
interface Props {
  answers: {
    ingredients: string[]
    genre: string
    cookingTime: string
  }
}

export const Keywords = ({ answers }: Props) => {
  return (
    <div className={styles.box}>
      <span className={styles.title}>あなたの検索ワード🔍&nbsp;&nbsp;</span>

      <div className={styles.text}>{[...answers.ingredients, answers.genre, answers.cookingTime].join(" ")}</div>
    </div>
  )
}
