const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT

export const postSearchRecipesApi = (): string => {
  return `${API_BASE_URL}/searchRecipes`
}

export const getUserFavoritesApi = (id: string): string => {
  return `${API_BASE_URL}/favorites/${id}`
}

export const postUserFavoritesApi = (): string => {
  return `${API_BASE_URL}/favorites`
}

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

export const convertAnswersToSearchInfo = (answers: Answers): SearchInfo => {
  const info: SearchInfo = { ingredients: [], keywords: [] }
  if (answers) {
    info.ingredients = answers.ingredients
  }
  return info
}
