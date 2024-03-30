import { useNavigate } from "react-router-dom"
import { BackButton } from "@/components/elements/button/BackButton"
import { NextButton } from "@/components/elements/button/NextButton"
import { RadioButtonCard } from "@/components/RadioButtonCard"
import { Option } from "@/utils/questions"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  answer: string | undefined
  setAnswer: (answer: string) => void
}

export const QuestionCookingTime = ({ setQuestionNumber, answer, setAnswer }: Props) => {
  const navigate = useNavigate()

  const options: Option[] = [
    { value: "時短", description: "目安時間: 15分" },
    { value: "普通", description: "目安時間: 30分" },
    { value: "じっくり", description: "目安時間: 60分" },
    { value: "どれでも", description: "目安時間: なし" },
  ]

  const onClickNextPage = () => {
    navigate("/result")
  }

  return (
    <div style={{ padding: "32px 16px" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <BackButton onClick={() => setQuestionNumber(0)} />
        {/* <Searchbox /> */}
      </div>
      <div
        style={{ margin: "16px 0", display: "inline-flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            gap: 4,
          }}
        >
          <h1>調理時間</h1>
          <h5>調理にかける時間を選択してください</h5>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          {options.map((option) => (
            <RadioButtonCard key={option.value} option={option} selectedOption={answer} handleChange={setAnswer} />
          ))}
        </div>

        <NextButton title={"レシピを検索する"} onClick={onClickNextPage} />
      </div>
    </div>
  )
}
