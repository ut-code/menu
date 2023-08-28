import styles from "./QuestionGroup.module.css"

import { Head } from "@/components/Head"
import { QuestionText } from "../QuestionText"
import { Searchbox } from "@/components/Searchbox"

interface Props {
  showBackButton: boolean
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
  const className = props.userInput ? styles.green : styles.notgreen

  return (
    <div className={className}>
      <Head
        showBackButton={props.showBackButton}
        onClickPreviousPage={props.onClickPreviousPage}
        onClickOpenHamburger={props.onClickOpenHamburger}
      />
      <QuestionText questionText={props.questionText} userInput={props.userInput} />
      {props.userInput && (
        <Searchbox
          onClickHandler={props.onClickResultPage}
          onChange={props.onChange}
          inputContent={props.inputContent}
          placeholder="食材の名前を入力してみましょう"
        />
      )}
    </div>
  )
}
