import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import styles from "./HorizontalScroll.module.css"

import { Recipe } from "@/utils/recipes"

export const HorizontalScroll = () => {
  const recipes: Recipe[] = [
    {
      id: 1,
      recipeTitle: "test",
      recipeUrl: "https://cookpad.com/recipe/1234567",
      recipeDescription: "test",
      foodImageUrls: [],
      keywords: [],
      totalTime: 30,
      recipeMaterial: ["じゃがいも", "にんじん", "玉ねぎ", "牛肉", "水", "カレールー"],
    },
    {
      id: 2,
      recipeTitle: "testest",
      recipeUrl: "https://cookpad.com/recipe/1234567",
      recipeDescription: "test",
      foodImageUrls: [],
      keywords: [],
      totalTime: 30,
      recipeMaterial: ["じゃがいも", "にんじん", "玉ねぎ", "牛肉", "水", "カレールー"],
    },
    {
      id: 3,
      recipeTitle: "testest",
      recipeUrl: "https://cookpad.com/recipe/1234567",
      recipeDescription: "test",
      foodImageUrls: [],
      keywords: [],
      totalTime: 30,
      recipeMaterial: ["じゃがいも", "にんじん", "玉ねぎ", "牛肉", "水", "カレールー"],
    },
    {
      id: 4,
      recipeTitle: "testest",
      recipeUrl: "https://cookpad.com/recipe/1234567",
      recipeDescription: "test",
      foodImageUrls: [],
      keywords: [],
      totalTime: 30,
      recipeMaterial: ["じゃがいも", "にんじん", "玉ねぎ", "牛肉", "水", "カレールー"],
    },
  ]

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
      {recipes.map((recipe) => (
        <SwiperSlide key={recipe.id}>
          <div className={styles.card}>{recipe.recipeTitle}</div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
