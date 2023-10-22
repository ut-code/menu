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
  genre: string
  cookingTime: string
}

export type SearchInfo = {
  ingredients: string[]
  time?: string
  dish?: string // 主菜・副菜など
}

export const convertAnswersToSearchInfo = (answers: Answers): SearchInfo => {
  const info: SearchInfo = { ingredients: [], time: "" }
  if (answers) {
    info.ingredients = answers.ingredients
    info.time = answers.cookingTime
  }
  return info
}
