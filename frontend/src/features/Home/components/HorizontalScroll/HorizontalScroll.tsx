import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import styles from "./HorizontalScroll.module.css"

import { Recipe } from "@/utils/recipes"

interface Props {
  recipes?: Recipe[]
}

export const HorizontalScroll = ({ recipes }: Props) => {
  return (
    <Swiper
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      slidesPerView={3}
      spaceBetween={30}
      freeMode={true}
      modules={[FreeMode]}
      className={styles.root}
    >
      {recipes &&
        recipes.map((recipe) => (
          <SwiperSlide key={recipe.id}>
            <div className={styles.card}>{recipe.recipeTitle}</div>
          </SwiperSlide>
        ))}
    </Swiper>
  )
}
