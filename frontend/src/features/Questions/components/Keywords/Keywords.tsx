import styles from "./Keywords.module.css"

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
      <br></br>
      <div className={styles.text}>
        {/* {props.answers.map((answer, index) => (
          <span key={index}>{answer.content}&nbsp;</span>
        ))} */}
        {[...answers.ingredients, answers.genre, answers.cookingTime].join(" ")}
      </div>
    </div>
  )
}
