import styles from "./TextField.module.css"

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
}

export const TextField = ({ label, value, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={styles.root}>
      <input type="text" value={value} onChange={handleChange} />
      <label>{label}</label>
    </div>
  )
}
