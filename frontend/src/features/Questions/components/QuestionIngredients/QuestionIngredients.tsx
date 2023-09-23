import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Session } from "@supabase/supabase-js"

import { NextButton } from "@/components/elements/button/NextButton"
import { Searchbox } from "@/components/Searchbox"
import { Option, allIngredients, shuffleOptions } from "@/utils/questions"
import iconPlus from "@/assets/icon/icon_plus.svg"
import { BsCheckLg } from "react-icons/bs"
import { Head } from "@/components/Head"
import { Hamburger } from "@/components/Hamburger"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  ingredients: string[] | undefined
  setIngredients: (ingredients: string[]) => void
  session: Session | null
}

const shuffledOptions: Option[] = shuffleOptions(allIngredients)

export const QuestionIngredients = ({ setQuestionNumber, ingredients, setIngredients, session }: Props) => {
  const Navigate = useNavigate()
  const [inputContent, setInputContent] = useState<string>("")
  const [showIngredientsNumber, setShowIngredientsNumber] = useState<number>(3)
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
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

  const onClickNextPage = () => {
    if (ingredients === undefined || ingredients.length === 0) {
      // FIXME: アラートを実装する
      alert("選択肢を選んでください")
      return
    }
    setQuestionNumber(1)
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isOpenHamburger) return <Hamburger session={session} onClickCloseHamburger={onClickCloseHamburger} />
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
          <p style={{ marginBottom: 4 }}>食材は2個以上入力することができます(例：玉ねぎ 牛乳)</p>
          <p>食材を2個以上入力するときは、スペースを空けてください</p>
        </div>

        <NextButton onClick={onClickNextPage} />
      </div>
    </>
  )
}
