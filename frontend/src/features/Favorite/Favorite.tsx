import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { Recipe, getUserFavoritesApi, deleteUserFavoritesApi } from "@/utils/recipes"

interface Props {
  session: Session | null
}

export const Favorite = ({ session }: Props) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    const fetchUserFavorites = async (userId: string) => {
      // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
      if (!session) return
      const response = await fetch(getUserFavoritesApi(userId), {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
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

    if (session?.user?.id) {
      fetchUserFavorites(session?.user?.id)
    }
  }, [session?.user?.id])

  const onClickDeleteFavorite = (recipeId: number) => async () => {
    if (!session?.user?.id) return
    const response = await fetch(deleteUserFavoritesApi(session?.user?.id, recipeId), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session?.user?.id, recipeId: recipeId }),
    })
    const userFavorite = await response.json()
    console.log(userFavorite)
  }

  if (!session?.user?.id) return null
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
