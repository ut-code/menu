import styles from "./Searchbox.module.css"
import SearchIcon from "@mui/icons-material/Search"

interface Props {
  onClickHandler: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputContent: string
  placeholder: string
}

export const Searchbox = ({ onClickHandler, onChange, inputContent, placeholder }: Props) => {
  return (
    <div className={styles.input}>
      <SearchIcon className={styles.icon} onClick={onClickHandler} />
      <input type="text" placeholder={placeholder} value={inputContent} onChange={onChange} />
    </div>
  )
}
