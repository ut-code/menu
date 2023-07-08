import { useNavigate } from "react-router-dom"

import { BsFilterLeft } from "react-icons/bs"
import styles from "./QuestionHeader.module.css"

import { BackButton } from "@/components/elements/button/BackButton"

interface Props {
  questionNumber: number
  onClickPreviousPage: () => void
  onClickOpenHamburger: () => void
}

export const QuestionHeader = (props: Props) => {
  const Navigate = useNavigate()

  return (
    <div className={styles.root}>
      {props.questionNumber === 0 && (
        <div className={styles.logo} onClick={() => Navigate("/home")}>
          だるめし Dull Meshi
        </div>
      )}
      {props.questionNumber > 0 && <BackButton onClick={props.onClickPreviousPage} />}
      <div className={styles.howto} onClick={props.onClickOpenHamburger}>
        <BsFilterLeft size="1.8rem" />
      </div>
    </div>
  )
}
