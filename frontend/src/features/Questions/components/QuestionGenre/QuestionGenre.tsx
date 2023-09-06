import { NextButton } from "@/components/elements/button/NextButton"
import { Head } from "@/components/Head"
interface Props {
  setQuestionNumber: (questionNumber: number) => void
  answer: string | undefined
  setAnswer: (answer: string) => void
}

export const QuestionGenre = ({ setQuestionNumber, answer, setAnswer }: Props) => {
  const onClickNextPage = () => {
    if (answer === "") {
      // FIXME: アラートを実装する
      alert("選択肢を選んでください")
      return
    }

    setQuestionNumber(2)
  }

  return (
    <>
      <Head
        showBackButton={true}
        onClickPreviousPage={() => setQuestionNumber(0)}
        onClickOpenHamburger={() => console.log("wip")}
      />
      <button onClick={() => setAnswer("主食")}>主食</button>
      <button onClick={() => setAnswer("主菜・副菜")}>主菜・副菜</button>
      <button onClick={() => setAnswer("スープ")}>スープ</button>
      <button onClick={() => setAnswer("その他")}>その他</button>
      <NextButton onClick={onClickNextPage} />
    </>
  )
}
