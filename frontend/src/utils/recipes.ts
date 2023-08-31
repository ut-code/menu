const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT

export const postSearchRecipesApi = (): string => {
  return `${API_BASE_URL}/api/searchRecipes`
}

export const getUserFavoritesApi = (): string => {
  return `${API_BASE_URL}/api/users/favorites`
}

export const postUserFavoritesApi = (): string => {
  return `${API_BASE_URL}/api/users/favorites`
}

export const deleteUserFavoritesApi = (id: number): string => {
  return `${API_BASE_URL}/api/users/favorites/${id}`
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
