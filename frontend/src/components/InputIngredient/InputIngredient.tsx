import styles from "./InputIngredient.module.css"
import { FiSearch } from "react-icons/fi"

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputContent: string
  placeholder: string
}

export default function InputIngredient(props: Props) {
  return (
    <div className={styles.search}>
      <input
        className={styles.box}
        type="text"
        placeholder={props.placeholder}
        value={props.inputContent}
        onChange={props.onChange}
      />
      <FiSearch className={styles.icon} />
    </div>
  )
}
