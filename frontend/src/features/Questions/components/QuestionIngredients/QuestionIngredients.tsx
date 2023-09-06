import { NextButton } from "@/components/elements/button/NextButton"

interface Props {
  setQuestionNumber: (questionNumber: number) => void
  ingredients: string[] | undefined
  setIngredients: (ingredients: string[]) => void
}

export const QuestionIngredients = ({ setQuestionNumber, ingredients, setIngredients }: Props) => {
  return (
    <>
      <button onClick={() => setIngredients(["卵"])}>卵</button>
      <NextButton onClick={() => setQuestionNumber(1)} />
    </>
  )
}
