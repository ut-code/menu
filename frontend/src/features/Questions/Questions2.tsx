import { useNavigate } from "react-router-dom"
import { useLocalStorage } from "react-use"

import { QuestionIngredients } from "./components/QuestionIngredients"
import { QuestionGenre } from "./components/QuestionGenre"

export const Questions = () => {
  const Navigate = useNavigate()

  const [questionNumber, setQuestionNumber, removeQuestionNumber] = useLocalStorage("questionNumber", 0)
  const [ingredients, setIngredients, removeIngredients] = useLocalStorage("ingredients", [])
  const [genre, setGenre, removeGenre] = useLocalStorage("genre", "")
  const [cookingTime, setCookingTime, removeCookingTime] = useLocalStorage("cookingTime", "")

  switch (questionNumber) {
    case 0:
      return <QuestionIngredients setQuestionNumber={setQuestionNumber} setIngredients={setIngredients} />
    case 1:
      return <QuestionGenre setQuestionNumber={setQuestionNumber} setGenre={setGenre} />
    default:
      Navigate("/results")
  }
}