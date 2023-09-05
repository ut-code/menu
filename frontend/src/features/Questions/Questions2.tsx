import { useLocalStorage } from "react-use"

import { QuestionIngredients } from "./components/QuestionIngredients"

export const Questions = () => {
  const [questionNumber, setQuestionNumber, removeQuestionNumber] = useLocalStorage("questionNumber", 0)
  const [ingredients, setIngredients, removeIngredients] = useLocalStorage("ingredients", [])
  const [genre, setGenre, removeGenre] = useLocalStorage("genre", "")
  const [cookingTime, setCookingTime, removeCookingTime] = useLocalStorage("cookingTime", "")

  switch (questionNumber) {
    case 0:
      return <QuestionIngredients setQuestionNumber={setQuestionNumber} />
    default:
      return <>{"質問1"}</>
  }
}
