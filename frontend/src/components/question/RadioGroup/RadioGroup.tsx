import { RadioButton } from "@/components/question/RadioButton"
import styles from "./RadioGroup.module.css"

type Choices = {
  [key: number]: {
    choiceText: string
    choiceImage: string
  }
}

interface Props {
  options: Choices
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputContent: string
  userInput: boolean
}

export const RadioGroup = (props: Props) => {
  return (
    <div>
      {props.userInput && <div className={styles.text}>Recommend</div>}

      <div className={styles.root}>
        {Object.values(props.options).map((option, index) => (
          <div key={index}>
            <RadioButton
              index={index}
              value={option.choiceText}
              ingredientImage={option.choiceImage}
              onChange={props.onChange}
              inputContent={props.inputContent}
              userInput={props.userInput}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
