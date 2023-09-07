import styles from "./Searchbox.module.css"
import { FiSearch } from "react-icons/fi"

interface Props {
  onClickHandler: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputContent: string
  placeholder: string
}

export const Searchbox = ({ onClickHandler, onChange, inputContent, placeholder }: Props) => {
  return (
    <div className={styles.search}>
      <input className={styles.box} type="text" placeholder={placeholder} value={inputContent} onChange={onChange} />
      <FiSearch className={styles.icon} onClick={onClickHandler} />
    </div>
  )
}
