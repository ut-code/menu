import { useState } from "react"
import { Session } from "@supabase/supabase-js"

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
  session: Session | null
}

export const QuestionGenre = ({ setQuestionNumber, answer, setAnswer, keywords, session }: Props) => {
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)

  const options: Option[] = [
    { id: "1", value: "主食" },
    { id: "2", value: "主菜" },
    { id: "3", value: "副菜" },
    { id: "4", value: "スープ" },
  ]

  const onClickNextPage = () => {
    if (answer === "") {
      // FIXME: アラートを実装する
      alert("選択肢を選んでください")
      return
    }
    setQuestionNumber(2)
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isOpenHamburger) return <Hamburger session={session} onClickCloseHamburger={onClickCloseHamburger} />
  return (
    <div className="style_lightbrown">
      <Head
        showBackButton={true}
        onClickPreviousPage={() => setQuestionNumber(0)}
        onClickOpenHamburger={onClickOpenHamburger}
      />

      <h2 style={{ margin: "30px auto" }}>料理のカテゴリを選択してください</h2>
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
