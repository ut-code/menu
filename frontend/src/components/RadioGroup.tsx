import RadioButton from "@/components/RadioButton"
import styles from "@/assets/css/RadioGroup.module.css"

type Choices = {
  [key: number]: {
    choiceText: string
    choiceImage: string
  }
}

export default function RadioGroup(props: { options: Choices; onChange; inputContent: string; userInput: boolean }) {
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
