import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { NextButton } from "@/components/elements/button/NextButton"
import { Searchbox } from "@/components/Searchbox"
import { Option, allIngredients, shuffleOptions } from "@/utils/questions"
import iconPlus from "@/assets/icon/icon_plus.svg"
import { BsCheckLg } from "react-icons/bs"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  ingredients: string[] | undefined
  setIngredients: (ingredients: string[]) => void
}

const shuffledOptions: Option[] = shuffleOptions(allIngredients)

export const QuestionIngredients = ({ setQuestionNumber, ingredients, setIngredients }: Props) => {
  const Navigate = useNavigate()
  const [inputContent, setInputContent] = useState<string>("")
  const [showIngredientsNumber, setShowIngredientsNumber] = useState<number>(3)
  useEffect(() => {
    if (ingredients !== undefined) {
      setInputContent(ingredients.join(" "))
    }
  }, [ingredients])
  const options: Option[] = shuffledOptions.slice(0, showIngredientsNumber)

  const toggleOption = (value: string) => {
    if (!ingredients) return
    if (ingredients.includes(value)) {
      setIngredients(ingredients.filter((ingredient) => ingredient !== value))
    } else {
      setIngredients([...ingredients, value])
    }
  }

  // NOTE: inputContentを変化させたらingredientsも変化させている
  const onChangeSearchbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value)
    setIngredients(e.target.value.split(" "))
  }

  const onChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleOption(e.target.value)
    if (ingredients !== undefined) {
      setInputContent(ingredients.join(" "))
    }
  }

  const incrementIngredientsNumber = () => {
    setShowIngredientsNumber((prev) => (prev + 1 < shuffledOptions.length ? prev + 1 : prev))
  }

  return (
    <div>
      {/* <div className="style_lightbrown"> */}
      <Searchbox
        onClickHandler={() => Navigate("/search")}
        placeholder={"食材の名前を入力してみましょう"}
        onChange={onChangeSearchbox}
        inputContent={inputContent}
      />
      <div className={"boxes"}>
        {options.map((option) => (
          <div key={option.id} className={"box pic"}>
            <input
              type="checkbox"
              id={option.id}
              value={option.value}
              checked={inputContent.includes(option.value)}
              onChange={onChangeCheckbox}
            />
            <label htmlFor={option.id}>
              <div>
                {ingredients && ingredients.includes(option.value) ? (
                  <div className={"pic_filter"}>
                    <BsCheckLg size="2rem" />
                  </div>
                ) : (
                  <div>
                    <img className={"pic_iframe"} src={option.image} />
                    <div className={"pic_heading"}>{option.value}</div>
                  </div>
                )}
              </div>
            </label>
          </div>
        ))}
        <div className={"box nopic"}>
          <div className={"nopic_text"} onClick={incrementIngredientsNumber}>
            <img src={iconPlus} alt="icon_plus" />
          </div>
        </div>
      </div>
      <NextButton onClick={() => setQuestionNumber(1)} />
    </div>
  )
}
