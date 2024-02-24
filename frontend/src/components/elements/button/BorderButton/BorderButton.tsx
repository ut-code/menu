import styles from "./BorderButton.module.css"

interface Props {
  onClick: () => void
  disabled: boolean
  isWhite?: boolean
  children: React.ReactNode
}

export const BorderButton = ({ onClick, disabled, isWhite, children }: Props) => {
  const buttonStyle = {
    backgroundColor: isWhite ? "white" : "#f5b72e",
  }

  return (
    <button className={styles.button} onClick={onClick} disabled={disabled} style={buttonStyle}>
      <h3>{children}</h3>
    </button>
  )
}
