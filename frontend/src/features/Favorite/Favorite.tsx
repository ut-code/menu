import { useState, useEffect } from "react"
import { Recipe, getUserFavoritesApi, deleteUserFavoritesApi } from "@/utils/recipes"

interface Props {
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
  }, [props.userId])

  const onClickDeleteFavorite = (recipeId: number) => async () => {
    if (!props.userId) return
    const response = await fetch(deleteUserFavoritesApi(props.userId, recipeId), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: props.userId, recipeId: recipeId }),
    })
    const userFavorite = await response.json()
    console.log(userFavorite)
  }

  if (!props.userId) return null
  return (
    <>
      <div className="style_lightbrown">
        <h1>お気に入り</h1>
        {favoriteRecipes.length > 0 ? (
          <ul>
            {favoriteRecipes.map((recipe) => (
              <span key={recipe.id}>
                <li>{recipe.recipeTitle}</li>
                <button onClick={onClickDeleteFavorite(recipe.id)}>お気に入りから削除</button>
              </span>
            ))}
          </ul>
        ) : (
          <p>お気に入りはまだありません。ハートボタンを押して追加してみましょう。</p>
        )}
      </div>
    </>
  )
}
