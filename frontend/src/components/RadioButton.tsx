import styles from "@/assets/css/RadioButton.module.css"

interface Props {
  index: number
  value: string
  ingredientImage: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputContent: string
  userInput: boolean
}

export default function RadioButton(props: Props) {
  const className = props.userInput ? styles.pic : styles.nopic

  return (
    <div className={`${styles.box} ${className}`}>
      <input
        id={props.index.toString()}
        type="radio"
        defaultValue={props.value}
        onChange={props.onChange}
        checked={props.inputContent === props.value}
      />
      <label htmlFor={props.index.toString()}>
        {props.userInput === true && (
          <div>
            <img className={styles.pic_iframe} src={props.ingredientImage} />
            <div className={styles.pic_heading}>{props.value}</div>
          </div>
        )}
        {props.userInput === false && <div className={styles.nopic_text}>{props.value}</div>}
      </label>
    </div>
  )
}
