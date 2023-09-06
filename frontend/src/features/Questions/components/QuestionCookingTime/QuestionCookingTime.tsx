import { useNavigate } from "react-router-dom"

import { NextButton } from "@/components/elements/button/NextButton"
import { Head } from "@/components/Head"
import { Keywords } from "../Keywords"
import { Option } from "@/utils/questions"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  answer: string | undefined
  setAnswer: (answer: string) => void
  keywords: (string | undefined)[]
}

export const QuestionCookingTime = ({ setQuestionNumber, answer, setAnswer, keywords }: Props) => {
  const Navigate = useNavigate()
  const options: Option[] = [
    { id: "1", value: "時短" },
    { id: "2", value: "普通" },
    { id: "3", value: "じっくり" },
    { id: "4", value: "どれでも" },
  ]

  return (
    <div className="style_lightbrown">
      <Head
        showBackButton={true}
        onClickPreviousPage={() => setQuestionNumber(1)}
        onClickOpenHamburger={() => console.log("wip")}
      />
      <h2>調理時間を選択してください</h2>
      <Keywords keywords={keywords} />
      <div className={"boxes"}>
        {options.map((option) => (
          <div key={option.id} className={"box nopic"}>
            <input
              type="radio"
              id={option.id}
              value={option.value}
              checked={answer === option.value}
              onChange={() => setAnswer(option.value)}
            />
            <label htmlFor={option.id}>
              <div className={"nopic_text"}>{option.value}</div>
            </label>
          </div>
        ))}
      </div>
      <div className={"space"} />
      <NextButton onClick={() => Navigate("/search")} />
    </div>
  )
}
