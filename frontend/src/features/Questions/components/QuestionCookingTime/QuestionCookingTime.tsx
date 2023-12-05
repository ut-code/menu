import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { NextButton } from "@/components/elements/button/NextButton"
import { Head } from "@/components/Head"
import { Hamburger } from "@/components/Hamburger"
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
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)

  const options: Option[] = [
    { id: "1", value: "時短", description: "目安時間: 15分" },
    { id: "2", value: "普通", description: "目安時間: 30分" },
    { id: "3", value: "じっくり", description: "目安時間: 60分" },
    { id: "4", value: "どれでも", description: "目安時間: なし" },
  ]

  const onClickNextPage = () => {
    if (answer === "") {
      // FIXME: アラートを実装する
      alert("選択肢を選んでください")
      return
    }
    Navigate("/search")
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isOpenHamburger) return <Hamburger onClickCloseHamburger={onClickCloseHamburger} />
  return (
    <div className="style_lightbrown">
      <Head
        showBackButton={true}
        onClickPreviousPage={() => setQuestionNumber(1)}
        onClickOpenHamburger={onClickOpenHamburger}
      />
      <h2 style={{ margin: "30px auto" }}>調理時間を選択してください</h2>
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
              <div className={"nopic_text"}>
                {option.value}
                <div className={"nopic_description"}>{option.description}</div>
              </div>
            </label>
          </div>
        ))}
      </div>
      <div className={"space"} />
      <NextButton onClick={onClickNextPage} />
    </div>
  )
}
