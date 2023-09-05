interface Props {
  setQuestionNumber: (questionNumber: number) => void
}

export const QuestionIngredients = ({ setQuestionNumber }: Props) => {
  return <button onClick={() => setQuestionNumber(1)}>ボタン</button>
}
