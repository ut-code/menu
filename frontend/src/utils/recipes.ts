export type Recipe = {
  id: number
  title: string
  description: string
  totalCookingTime: number
  materials: string[]
  keywords: string[]
  sourceUrl: string
  foodImageUrl: string
  dish: string
  createdAt: string
}

export type SearchInfo = {
  ingredients: string[]
  dish: string | null
  cookingTime: string | null
}
