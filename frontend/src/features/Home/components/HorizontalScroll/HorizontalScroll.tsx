import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import "./swiper.css"

import { Recipe } from "@/utils/recipes"
import { Card } from "../Card"

interface Props {
  recipes?: Recipe[]
}

export const HorizontalScroll = ({ recipes }: Props) => {
  return (
    <Swiper
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      slidesPerView={"auto"}
      spaceBetween={35}
      freeMode={true}
      modules={[FreeMode]}
      className={"root"}
    >
      {recipes &&
        recipes.map((recipe) => (
          <SwiperSlide key={recipe.id}>
            <Card recipe={recipe} />
          </SwiperSlide>
        ))}
    </Swiper>
  )
}
