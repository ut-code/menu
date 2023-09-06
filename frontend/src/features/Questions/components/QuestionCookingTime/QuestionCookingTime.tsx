import { useNavigate } from "react-router-dom"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  setAnswer: (answer: string) => void
}

export const QuestionCookingTime = ({ setQuestionNumber, setAnswer }: Props) => {
  const Navigate = useNavigate()

  return (
    <>
      <button onClick={() => setQuestionNumber(1)}>戻る</button>
      <button onClick={() => setAnswer("15分")}>15分</button>
      <button onClick={() => setAnswer("30分")}>30分</button>
      <button onClick={() => setAnswer("60分")}>60分</button>
      <button onClick={() => Navigate("/search")}>次へ</button>
    </>
  )
}
