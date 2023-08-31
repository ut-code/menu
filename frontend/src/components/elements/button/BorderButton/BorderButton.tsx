import styles from "./BorderButton.module.css"

interface Props {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}

export const BorderButton = ({ onClick, children, disabled }: Props) => {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
