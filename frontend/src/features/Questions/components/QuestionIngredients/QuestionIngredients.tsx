import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { NextButton } from "@/components/elements/button/NextButton"
import { Searchbox } from "@/components/Searchbox"
import { Head } from "@/components/Head"
import { Hamburger } from "@/components/Hamburger"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  ingredients: string[] | undefined
  setIngredients: (ingredients: string[]) => void
}

export const QuestionIngredients = ({ setQuestionNumber, ingredients, setIngredients }: Props) => {
  const Navigate = useNavigate()
  const [inputContent, setInputContent] = useState<string>("")
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
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
    if (ingredients === undefined || ingredients.length === 0) {
      alert("食材を入力してください")
      return
    }
    setQuestionNumber(1)
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isOpenHamburger) return <Hamburger onClickCloseHamburger={onClickCloseHamburger} />
  return (
    <>
      <div style={{ padding: 16 }}>
        <Head
          showBackButton={false}
          onClickPreviousPage={() => setQuestionNumber(0)}
          onClickOpenHamburger={onClickOpenHamburger}
          filterWhite={false}
        />

        <h1 style={{ paddingLeft: 16, lineHeight: 1.7, marginTop: 120, marginBottom: 32 }}>
          余り物も料理のヒントも、
          <br />
          だるめしにおまかせ。
        </h1>
        <Searchbox
          onClickHandler={() => Navigate("/search")}
          placeholder={"食材の名前を入力してみましょう"}
          onChange={onChangeSearchbox}
          inputContent={inputContent}
        />
        <div style={{ paddingLeft: 16, paddingRight: 16, marginTop: 24, marginBottom: 96 }}>
          <h3 style={{ marginBottom: 8 }}>入力のヒント💡</h3>
          <p style={{ marginBottom: 4 }}>食材を2個以上入力するときは、スペースを空けてください(例：玉ねぎ 牛乳)</p>
        </div>

        <NextButton onClick={onClickNextPage} />
      </div>
    </>
  )
}
