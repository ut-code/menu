import React from "react"
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
    <div className={`${styles.root} ${value !== "" ? styles.filled : ""}`}>
      <label>{label}</label>
      <input type="text" value={value} onChange={handleChange} />
    </div>
  )
}
