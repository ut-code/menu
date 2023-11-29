export type Recipe = {
  id: number
  title: string
  description: string
  totalCookingTime: number
  materials: string[]
  keywords: string[]
  sourceUrl: string
  foodImageUrl: string
}

export type Answers = {
  ingredients: string[]
  genre: string | null
  cookingTime: string | null
}

export type SearchInfo = {
  ingredients: string[]
  time: string | null
  dish: string | null // 主菜・副菜など
}

export const convertAnswersToSearchInfo = (answers: Answers): SearchInfo => {
  const info: SearchInfo = {
    ingredients: answers.ingredients,
    time: answers.cookingTime,
    dish: answers.genre,
  }
  return info
}
