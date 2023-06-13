import styles from "./RadioButton.module.css"
import { BsCheckLg } from "react-icons/bs"

interface Props {
  index: number
  value: string
  ingredientImage: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputContent: string
  userInput: boolean
}

export const RadioButton = (props: Props) => {
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
            {props.inputContent === props.value && ( //選択された時
              <div className={styles.pic_filter}>
                <BsCheckLg size="2rem" />
              </div>
            )}

            {props.inputContent !== props.value && ( //選択されていない時
              <div>
                <img className={styles.pic_iframe} src={props.ingredientImage} />
                <div className={styles.pic_heading}>{props.value}</div>
              </div>
            )}
          </div>
        )}
        {props.userInput === false && <div className={styles.nopic_text}>{props.value}</div>}
      </label>
    </div>
  )
}
