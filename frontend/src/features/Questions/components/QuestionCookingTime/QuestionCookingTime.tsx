import { useNavigate } from "react-router-dom"

import { NextButton } from "@/components/elements/button/NextButton"
import { Head } from "@/components/Head"
import { Keywords } from "../Keywords"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  answer: string | undefined
  setAnswer: (answer: string) => void
  keywords: (string | undefined)[]
}

export const QuestionCookingTime = ({ setQuestionNumber, answer, setAnswer, keywords }: Props) => {
  const Navigate = useNavigate()
  const options = [
    { id: "1", label: "時短" },
    { id: "2", label: "普通" },
    { id: "3", label: "じっくり" },
    { id: "4", label: "どれでも" },
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
              value={option.label}
              checked={answer === option.label}
              onChange={() => setAnswer(option.label)}
            />
            <label htmlFor={option.id}>
              <div className={"nopic_text"}>{option.label}</div>
            </label>
          </div>
        ))}
      </div>
      <div className={"space"} />
      <NextButton onClick={() => Navigate("/search")} />
    </div>
  )
}
