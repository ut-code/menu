//import { SwiperSlide } from "swiper/react"
import styles from "./EmptyResults.module.css"
//import { EmptyResults } from "@/components/EmptyResults"
import Sorry from "@/assets/image/Sorry.png"

export const EmptyResults = () => {
  return (
    <div className={styles.centerContainer}>
      <img src={Sorry} alt="アイコン" className="icon" />
      <h2>検索結果が見つかりません</h2>
      <div className={styles.explanetionText}>
        <p>大変申し訳ございません</p>
      </div>
    </div>
  )
}
