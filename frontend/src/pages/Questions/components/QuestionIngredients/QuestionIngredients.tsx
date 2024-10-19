import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Searchbox } from "../../../../components/Searchbox"
import { InfoBox } from "../../../../components/InfoBox"
import { NextButton } from "../../../../components/NextButton"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  ingredients: string[] | undefined
  setIngredients: (ingredients: string[]) => void
}

export const QuestionIngredients = ({ setQuestionNumber, ingredients, setIngredients }: Props) => {
  const navigate = useNavigate()
  const [inputContent, setInputContent] = useState<string>("")
  useEffect(() => {
    if (ingredients) {
      setInputContent(ingredients.join(" "))
    }
  }, [ingredients])

  // NOTE: inputContentを変化させたらingredientsも変化させている
  const onChangeSearchbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value)
    setIngredients(e.target.value.split(" "))
  }

  const onClickNextPage = () => {
    if (!ingredients || ingredients.length === 0 || ingredients[0] === "") {
      alert("食材を入力してください")
      return
    }
    setQuestionNumber(1)
  }

  return (
    <>
      <div style={{ padding: "16px 16px" }}>
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
          <Searchbox
            onClickHandler={() => navigate("/result")}
            placeholder={"例: 卵 トマト じゃがいも"}
            onChange={onChangeSearchbox}
            inputContent={inputContent}
          />
          <InfoBox title="💡 おすすめのキーワード" message="卵 トマト じゃがいも" />
          <InfoBox
            title="🐶 検索のヒント"
            message="冷蔵庫に余っているちょっと使い道に困るような食材の名前を入れてみると、自分では思いつかないようなレシピが見つかるかもしれません！"
          />
          <InfoBox
            title="🙅‍♂️ 検索できないワード"
            message="食材の名前ではないワード(例: ふわふわ・スープ)を入力するとうまく検索ができない可能性があります"
          />
        </div>
        <NextButton title={"次の質問に進む"} onClick={onClickNextPage} />
      </div>
    </>
  )
}
