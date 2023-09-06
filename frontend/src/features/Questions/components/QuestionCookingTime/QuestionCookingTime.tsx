interface Props {
  setQuestionNumber: (questionNumber: number) => void
  setCookingTime: (cookingTime: string) => void
}

export const QuestionCookingTime = ({ setQuestionNumber, setCookingTime }: Props) => {
  return (
    <>
      <button onClick={() => setCookingTime("15分")}>15分</button>
      <button onClick={() => setCookingTime("30分")}>30分</button>
      <button onClick={() => setCookingTime("60分")}>60分</button>
      <button onClick={() => setQuestionNumber(3)}>次へ</button>
    </>
  )
}
