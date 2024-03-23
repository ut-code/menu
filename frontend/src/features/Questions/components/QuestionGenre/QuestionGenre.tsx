// import { Searchbox } from "@/components/Searchbox"
import { BackButton } from "@/components/elements/button/BackButton"
import { NextButton } from "@/components/elements/button/NextButton"
import { RadioButtonCard } from "@/components/RadioButtonCard"
import { Option } from "@/utils/questions"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  answer: string | undefined
  setAnswer: (answer: string) => void
}

export const QuestionGenre = ({ setQuestionNumber, answer, setAnswer }: Props) => {
  const options: Option[] = [
    { value: "主食", description: "ご飯、パン、麺類など" },
    { value: "主菜", description: "おかず" },
    { value: "副菜", description: "おかず" },
    { value: "スープ", description: "おかず" },
    { value: "スイーツ", description: "デザート" },
  ]

  const onClickNextPage = () => {
    setQuestionNumber(2)
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <BackButton onClick={() => setQuestionNumber(0)} />
        {/* <Searchbox /> */}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        <h1>ジャンル</h1>
        <h6>作りたい料理の種類を選択してください</h6>
      </div>
      <RadioButtonCard options={options} selectedOption={answer} handleChange={setAnswer} />
      <NextButton onClick={onClickNextPage} />
    </div>
  )
}
