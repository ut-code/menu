import styles from "./Chips.module.css"
import CheckIcon from "@mui/icons-material/Check"

interface Props {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Chip = ({ label, checked, onChange }: Props) => {
  const handleClick = () => {
    onChange(!checked)
  }

  return (
    <div className={`${styles.chip} ${checked ? styles.checked : ""}`} onClick={handleClick}>
      {checked && <CheckIcon style={{ width: 18, height: 18 }} />}
      <input type="checkbox" checked={checked} readOnly />
      <label>{label}</label>
    </div>
  )
}
