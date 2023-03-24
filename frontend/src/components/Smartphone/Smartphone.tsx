import styles from "./Smartphone.module.css"
/* import image */
import img1 from "@/assets/image/howto1.png"
import img2 from "@/assets/image/howto2.png"
import img3 from "@/assets/image/howto3.png"

export default function Smartphone() {
  return (
    <div className={styles.frame}>
      <img src={img1} alt="スマホ画面1" className={styles.img1} />
    </div>
  )
}
