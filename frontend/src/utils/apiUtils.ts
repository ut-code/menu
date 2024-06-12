const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT

export const postSearchRecipesApi = (): string => {
  return `${API_BASE_URL}/api/recipes/search`
}

export const postSearchRecipesKeywordsApi = (): string => {
  return `${API_BASE_URL}/api/recipes/search/keywords`
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

export const getUserApi = (): string => {
  return `${API_BASE_URL}/api/users`
}

export const postSubmitRecipeApi = (): string => {
  return `${API_BASE_URL}/api/recipes/new`
}

export const postScrapeRecipeApi = (): string => {
  return `${API_BASE_URL}/api/recipes/scrape`
}
