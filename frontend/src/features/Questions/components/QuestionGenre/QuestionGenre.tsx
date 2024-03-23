// import { Searchbox } from "@/components/Searchbox"
import { BackButton } from "@/components/elements/button/BackButton"
import { NextButton } from "@/components/elements/button/NextButton"
import { Option } from "@/utils/questions"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  answer: string | undefined
  setAnswer: (answer: string) => void
}

export const QuestionGenre = ({ setQuestionNumber, answer, setAnswer }: Props) => {
  const options: Option[] = [
    { id: "1", value: "主食" },
    { id: "2", value: "主菜" },
    { id: "3", value: "副菜" },
    { id: "4", value: "スープ" },
    { id: "5", value: "スイーツ" },
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
      <div>
        {options.map((option) => (
          <div key={option.id}>
            <input
              type="radio"
              id={option.id}
              value={option.value}
              checked={answer === option.value}
              onChange={() => setAnswer(option.value)}
            />
            <label htmlFor={option.id}>
              <div>
                {option.value}
                <div>{option.description}</div>
              </div>
            </label>
          </div>
        ))}
      </div>
      <NextButton onClick={onClickNextPage} />
    </div>
  )
}
