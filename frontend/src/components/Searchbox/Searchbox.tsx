import styles from "./Searchbox.module.css"

interface Props {
  onClickHandler: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputContent: string
  placeholder: string
}

export const Searchbox = ({ onChange, inputContent, placeholder }: Props) => {
  return (
    <div>
      <input className={styles.input} type="text" placeholder={placeholder} value={inputContent} onChange={onChange} />
    </div>
  )
}
