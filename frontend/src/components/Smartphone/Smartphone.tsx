import styles from "./Smartphone.module.css"

export default function Smartphone(props: { img: string }) {
  return (
    <>
      <div className={styles.notch}></div>
      <div className={styles.frame}>
        <img src={props.img} alt="スマホ画面1" />
      </div>
    </>
  )
}
