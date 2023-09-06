import { useNavigate } from "react-router-dom"
import { useLocalStorage } from "react-use"

import "./questions.css"
import { QuestionIngredients } from "./components/QuestionIngredients"
import { QuestionGenre } from "./components/QuestionGenre"
import { QuestionCookingTime } from "./components/QuestionCookingTime"

export const Questions = () => {
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
        />
      )
    case 1:
      return <QuestionGenre setQuestionNumber={setQuestionNumber} answer={genre} setAnswer={setGenre} />
    case 2:
      return (
        <QuestionCookingTime
          setQuestionNumber={setQuestionNumber}
          answer={cookingTime}
          setAnswer={setCookingTime}
          keywords={keywords}
        />
      )
    default:
      Navigate("/search")
      return null
  }
}
