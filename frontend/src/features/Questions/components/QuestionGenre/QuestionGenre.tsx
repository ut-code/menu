interface Props {
  setQuestionNumber: (questionNumber: number) => void
  setAnswer: (answer: string) => void
}

export const QuestionGenre = ({ setQuestionNumber, setAnswer }: Props) => {
  return (
    <>
      <button onClick={() => setAnswer("和食")}>和食</button>
      <button onClick={() => setAnswer("洋食")}>洋食</button>
      <button onClick={() => setQuestionNumber(2)}>次へ</button>
    </>
  )
}
