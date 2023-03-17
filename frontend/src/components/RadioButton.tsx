import styles from "@/assets/css/RadioButton.module.css"

export default function RadioButton(props: {
  index: number
  value: string
  ingredientImage: string
  onChange
  inputContent: string
  userInput: boolean
}) {
  const className = props.userInput ? styles.pic : styles.nopic

  return (
    <div className={`${styles.box} ${className}`}>
      <input
        id={props.index}
        type="radio"
        defaultValue={props.value}
        onChange={props.onChange}
        checked={props.inputContent === props.value}
      />
      <label htmlFor={props.index}>
        {props.userInput === true && (
          <div>
            <img className={styles.pic_iframe} src={props.ingredientImage} />
            <div className={styles.pic_heading}>
              {props.value} {1 * Number(props.inputContent === props.value)}
            </div>
          </div>
        )}
        {props.userInput === false && (
          <div className={styles.nopic_text}>
            {props.value} {1 * Number(props.inputContent === props.value)}
          </div>
        )}
      </label>
    </div>
  )
}
