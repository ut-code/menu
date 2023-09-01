const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT

export const fetcher = (...args) => fetch(...args).then((res) => res.json())

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
