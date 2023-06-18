import styles from "./QuestionGroup.module.css"

import { QuestionHeader } from "../QuestionHeader/QuestionHeader"
import { QuestionText } from "../QuestionText/QuestionText"
import { InputIngredient } from "../InputIngredient/InputIngredient"

interface Props {
  questionNumber: number
  questionText: string
  userInput: boolean
  onClickPreviousPage: () => void
  onClickOpenHamburger: () => void
  onClickResultPage: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputContent: string
  placeholder: string
}

export const QuestionGroup = (props: Props) => {
  return (
    <div className={styles.root}>
      <QuestionHeader
        questionNumber={props.questionNumber}
        onClickPreviousPage={props.onClickPreviousPage}
        onClickOpenHamburger={props.onClickOpenHamburger}
      />
      <QuestionText questionText={props.questionText} userInput={props.userInput} />
      <InputIngredient
        onClickResultPage={props.onClickResultPage}
        onChange={props.onChange}
        inputContent={props.inputContent}
        placeholder="食材の名前を入力してみましょう"
      />
    </div>
  )
}
