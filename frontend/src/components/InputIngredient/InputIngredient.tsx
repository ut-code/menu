import styles from "./InputIngredient.module.css"

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputContent: string
  placeholder: string
}

export default function InputIngredient(props: Props) {
  return (
    <input
      className={styles.box}
      type="text"
      placeholder={props.placeholder}
      value={props.inputContent}
      onChange={props.onChange}
    />
  )
}
