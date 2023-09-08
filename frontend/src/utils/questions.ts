import imgBroccoli from "@/assets/image/broccoli.webp"
import imgEgg from "@/assets/image/egg.webp"
import imgMilk from "@/assets/image/milk.webp"
import imgPork from "@/assets/image/pork.webp"
import imgTomato from "@/assets/image/tomato.webp"
import imgOnion from "@/assets/image/onion.webp"
import imgCarrot from "@/assets/image/carrot.webp"
import imgChicken from "@/assets/image/chicken.jpg"
import imgLettuce from "@/assets/image/lettuce.webp"
import imgPotato from "@/assets/image/potato.webp"
import imgTofu from "@/assets/image/tofu.webp"
import imgShiiTake from "@/assets/image/shiitake.webp"
import imgEggPlant from "@/assets/image/eggplant.webp"
import imgBeanSprout from "@/assets/image/moyashi.webp"
import imgCabbage from "@/assets/image/cabbage.webp"
import imgDaikon from "@/assets/image/daikon.webp"
import imgGobou from "@/assets/image/burdock.webp"

export type Option = {
  id: string
  value: string
  description?: string
  image?: string
}

export const allIngredients: Option[] = [
  { id: "1", value: "卵", image: imgEgg },
  { id: "2", value: "トマト", image: imgTomato },
  { id: "3", value: "ブロッコリー", image: imgBroccoli },
  { id: "4", value: "牛乳", image: imgMilk },
  { id: "5", value: "玉ねぎ", image: imgOnion },
  { id: "6", value: "人参", image: imgCarrot },
  { id: "7", value: "鶏肉", image: imgChicken },
  { id: "8", value: "レタス", image: imgLettuce },
  { id: "9", value: "じゃがいも", image: imgPotato },
  { id: "10", value: "豆腐", image: imgTofu },
  { id: "11", value: "しいたけ", image: imgShiiTake },
  { id: "12", value: "豚肉", image: imgPork },
  { id: "13", value: "なす", image: imgEggPlant },
  { id: "14", value: "もやし", image: imgBeanSprout },
  { id: "15", value: "キャベツ", image: imgCabbage },
  { id: "16", value: "大根", image: imgDaikon },
  { id: "17", value: "ごぼう", image: imgGobou },
]

export const shuffleOptions = (array: Option[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
