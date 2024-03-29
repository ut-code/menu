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
    { value: "主食", description: "パン・麺・ごはんなどの穀類の料理" },
    { value: "主菜", description: "メインのおかずとなる料理" },
    { value: "副菜", description: "野菜・海藻・きのこなどを使った料理" },
    { value: "スープ", description: "みそ汁やポタージュなどの水分が多い料理" },
    { value: "スイーツ", description: "ケーキやプリンなどの甘いお菓子" },
  ]

  const onClickNextPage = () => {
    setQuestionNumber(2)
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
          <h1>ジャンル</h1>
          <h6>作りたい料理の種類を選択してください</h6>
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
        <NextButton title={"次の質問に進む"} onClick={onClickNextPage} />
      </div>
    </div>
  )
}
