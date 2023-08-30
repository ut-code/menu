import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Recipe, getUserFavoritesApi } from "@/utils/recipes"

interface Props {
  userId: string | undefined
}

export const Favorite = (props: Props) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  if (!props.userId) return null

  useEffect(() => {
    const fetchUserFavorites = async (userId: string) => {
      const response = await fetch(getUserFavoritesApi(userId))
      const favorites = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recipes = favorites.map((favorite: any) => favorite.favoriteRecipe)
      try {
        setFavoriteRecipes(recipes)
        console.log(recipes)
      } catch (error) {
        console.log(error)
      }
    }

    if (props.userId) {
      fetchUserFavorites(props.userId)
    }
  }, [])

  return (
    <>
      <div className="style_lightbrown">
        <h1>お気に入り</h1>
        {favoriteRecipes.length > 0 ? (
          <ul>
            {favoriteRecipes.map((recipe) => (
              <li key={recipe.id}>{recipe.recipeTitle}</li>
            ))}
          </ul>
        ) : (
          <p>お気に入りはまだありません。ハートボタンを押して追加してみましょう。</p>
        )}
      </div>
    </>
  )
}
