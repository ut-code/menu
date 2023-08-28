export type Recipe = {
  id: number
  recipeTitle: string
  recipeUrl: string
  recipeDescription: string
  foodImageUrls: string[]
  keywords: string[]
  totalTime: number
  recipeMaterial: string[]
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
  keywords: string[]
}
