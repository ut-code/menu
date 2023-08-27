import styles from "./Smartphone.module.css"

export const Smartphone = (props: { img: string }) => {
  return (
    <>
      <div className={styles.frame}>
        <div className={styles.notch}></div>
        <img src={props.img} alt="スマホ画面1" />
      </div>
    </>
  )
}
