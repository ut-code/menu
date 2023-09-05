interface Props {
  setQuestionNumber: (questionNumber: number) => void
  setGenre: (genre: string) => void
}

export const QuestionGenre = ({ setQuestionNumber, setGenre }: Props) => {
  return (
    <>
      <button onClick={() => setGenre("和食")}>和食</button>
      <button onClick={() => setGenre("洋食")}>洋食</button>
      <button onClick={() => setQuestionNumber(2)}>次へ</button>
    </>
  )
}
