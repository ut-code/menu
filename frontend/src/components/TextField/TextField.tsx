import React from "react"
import styles from "./TextField.module.css"

interface Props {
  label: string
  value: string | number | string[] | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextField = ({ label, value, onChange }: Props) => {
  return (
    <div className={`${styles.root} ${value ? styles.filled : ""}`}>
      <label>{label}</label>
      <input type="text" value={value} onChange={onChange} aria-label={label} />
    </div>
  )
}
