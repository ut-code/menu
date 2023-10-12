import { useNavigate } from "react-router-dom"
import { useLocalStorage } from "react-use"
import { Session } from "@supabase/supabase-js"

import "./questions.css"
import { QuestionIngredients } from "./components/QuestionIngredients"
import { QuestionGenre } from "./components/QuestionGenre"
import { QuestionCookingTime } from "./components/QuestionCookingTime"

interface Props {
  session: Session | null
}

export const Questions = ({ session }: Props) => {
  const Navigate = useNavigate()

  const [questionNumber, setQuestionNumber] = useLocalStorage("questionNumber", 0)
  const [ingredients, setIngredients] = useLocalStorage<string[]>("ingredients", [])
  const [genre, setGenre] = useLocalStorage("genre", "")
  const [cookingTime, setCookingTime] = useLocalStorage("cookingTime", "")
  const keywords = ingredients !== undefined ? [...ingredients, genre, cookingTime] : []

  switch (questionNumber) {
    case 0:
      return (
        <QuestionIngredients
          setQuestionNumber={setQuestionNumber}
          ingredients={ingredients}
          setIngredients={setIngredients}
          session={session}
        />
      )
    case 1:
      return (
        <QuestionGenre
          setQuestionNumber={setQuestionNumber}
          answer={genre}
          setAnswer={setGenre}
          keywords={keywords}
          session={session}
        />
      )
    case 2:
      return (
        <QuestionCookingTime
          setQuestionNumber={setQuestionNumber}
          answer={cookingTime}
          setAnswer={setCookingTime}
          keywords={keywords}
          session={session}
        />
      )
    default:
      setQuestionNumber(0)
      Navigate("/search")
      return null
  }
}
