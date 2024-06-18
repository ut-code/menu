import styles from "./BorderButton.module.css"

interface Props {
  onClick: () => void
  disabled: boolean
  isBlack?: boolean
  children: React.ReactNode
}

export const BorderButton = ({ onClick, disabled, isBlack, children }: Props) => {
  const buttonStyle = {
    borderColor: isBlack ? "#000" : "#c4c4c4",
  }

  return (
    <button className={styles.button} onClick={onClick} disabled={disabled} style={buttonStyle}>
      <h4>{children}</h4>
    </button>
  )
}
