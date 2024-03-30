import styles from "./InfoBox.module.css"

interface Props {
  title: string
  message: string
}

export const InfoBox = ({ title, message }: Props) => {
  return (
    <div className={styles.infobox}>
      <h4 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h4>
      <h4>{message}</h4>
    </div>
  )
}
