import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Searchbox } from "@/components/Searchbox"
import { InfoBox } from "@/components/InfoBox"
import { NextButton } from "@/components/elements/button/NextButton"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  ingredients: string[] | undefined
  setIngredients: (ingredients: string[]) => void
}

export const QuestionIngredients = ({ setQuestionNumber, ingredients, setIngredients }: Props) => {
  const navigate = useNavigate()
  const [inputContent, setInputContent] = useState<string>("")
  useEffect(() => {
    if (ingredients !== undefined) {
      setInputContent(ingredients.join(" "))
    }
  }, [ingredients])

  // NOTE: inputContentを変化させたらingredientsも変化させている
  const onChangeSearchbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value)
    setIngredients(e.target.value.split(" "))
  }

  const onClickNextPage = () => {
    setQuestionNumber(1)
  }

  return (
    <>
      <div style={{ padding: "32px 16px" }}>
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
          <Searchbox
            onClickHandler={() => navigate("/result")}
            placeholder={"例: 卵 トマト じゃがいも"}
            onChange={onChangeSearchbox}
            inputContent={inputContent}
          />
          <InfoBox />
          <InfoBox />
          <InfoBox />
        </div>
        <NextButton title={"次の質問に進む"} onClick={onClickNextPage} />
      </div>
    </>
  )
}
