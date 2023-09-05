interface Props {
  setQuestionNumber: (questionNumber: number) => void
  setIngredients: (ingredients: string[]) => void
}

export const QuestionIngredients = ({ setQuestionNumber, setIngredients }: Props) => {
  return (
    <>
      <button onClick={() => setIngredients(["卵"])}>卵</button>
      <button onClick={() => setQuestionNumber(1)}>次へ</button>
    </>
  )
}
