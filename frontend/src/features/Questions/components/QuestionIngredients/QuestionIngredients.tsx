import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { NextButton } from "@/components/elements/button/NextButton"
import { Searchbox } from "@/components/Searchbox"
import { Option } from "@/utils/questions"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  ingredients: string[] | undefined
  setIngredients: (ingredients: string[]) => void
}

export const QuestionIngredients = ({ setQuestionNumber, ingredients, setIngredients }: Props) => {
  const Navigate = useNavigate()
  const [inputContent, setInputContent] = useState<string>("")
  useEffect(() => {
    if (ingredients !== undefined) {
      setInputContent(ingredients.join(" "))
    }
  }, [ingredients])

  const options: Option[] = [
    { id: "1", value: "卵" },
    { id: "2", value: "牛乳" },
    { id: "3", value: "豆腐" },
  ]

  const toggleOption = (value: string) => {
    if (!ingredients) return
    if (ingredients.includes(value)) {
      setIngredients(ingredients.filter((ingredient) => ingredient !== value))
    } else {
      setIngredients([...ingredients, value])
    }
  }

  // NOTE: inputContentを変化させたらingredientsも変化させている
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value)
    setIngredients(e.target.value.split(" "))
  }

  return (
    <>
      <Searchbox
        onClickHandler={() => Navigate("/search")}
        placeholder={"食材の名前を入力してみましょう"}
        onChange={onChangeHandler}
        inputContent={inputContent}
      />
      <div className={"boxes"}>
        {options.map((option) => (
          <div key={option.id} className={"box nopic"}>
            <input
              type="checkbox"
              id={option.id}
              value={option.value}
              checked={inputContent.includes(option.value)}
              onChange={() => toggleOption(option.value)}
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
      <NextButton onClick={() => setQuestionNumber(1)} />
    </>
  )
}
