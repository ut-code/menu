import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Recipe, getUserFavoritesApi } from "@/utils/recipes"

interface Props {
  isLoggedIn: boolean
  userId: string | undefined
}

export const Favorite = (props: Props) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])

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
      {props.isLoggedIn ? (
        <div className="style_lightbrown">
          <h1>Favorite</h1>
          <ul>
            {favoriteRecipes.map((recipe) => (
              <li key={recipe.id}>{recipe.recipeTitle}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1>Sign In to view your favorite</h1>
          <Link to="/auth">
            <button>Sign In</button>
          </Link>
        </div>
      )}
    </>
  )
}
