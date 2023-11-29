//import { SwiperSlide } from "swiper/react"
import styles from "./EmptyResults.module.css"
//import { EmptyResults } from "@/components/EmptyResults"
import imgSorry from "@/assets/image/Sorry.png"

export const EmptyResults = () => {
  return (
    <div className={styles.centerContainer}>
      <img src={imgSorry} alt="イラスト" className={styles.icon} />
      <div className={styles.combinedText}>
        <h2>検索結果が見つかりません</h2>
        <div className={styles.smallExplanationText}>
          <p>大変申し訳ございません</p>
        </div>
      </div>
    </div>
  )
}
