import styles from "./BorderButton.module.css"

interface Props {
  onClick: () => void
  children: React.ReactNode
}

export const BorderButton = ({ onClick, children }: Props) => {
  return (
    <div className={styles.button} onClick={onClick}>
      {children}
    </div>
  )
}
