import styles from "./InputIngredient.module.css"
import { FiSearch } from "react-icons/fi"

interface Props {
  onClickResultPage: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputContent: string
  placeholder: string
}

export const InputIngredient = (props: Props) => {
  return (
    <div className={styles.search}>
      <input
        className={styles.box}
        type="text"
        placeholder={props.placeholder}
        value={props.inputContent}
        onChange={props.onChange}
      />
      <FiSearch className={styles.icon} onClick={props.onClickResultPage} />
    </div>
  )
}
