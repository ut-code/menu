interface Props {
  setQuestionNumber: (questionNumber: number) => void
  setAnswer: (answers: string[]) => void
}

export const QuestionIngredients = ({ setQuestionNumber, setAnswer }: Props) => {
  return (
    <>
      <button onClick={() => setAnswer(["卵"])}>卵</button>
      <button onClick={() => setQuestionNumber(1)}>次へ</button>
    </>
  )
}
