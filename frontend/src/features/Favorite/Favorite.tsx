import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Session } from "@supabase/supabase-js"
import useSWR from "swr"

import { Recipe } from "@/utils/recipes"
import { getUserFavoritesApi, deleteUserFavoritesApi } from "@/utils/apiUtils"

interface Props {
  session: Session | null
}

export const Favorite = ({ session }: Props) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchUserFavorites = async () => {
      // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
      if (!session) return
      const response = await fetch(getUserFavoritesApi(), {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const recipes: Recipe[] = await response.json()
      try {
        setFavoriteRecipes(recipes)
        console.log(recipes)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUserFavorites()
    setLoading(false)
  }, [loading])

  const onClickDeleteFavorite = (recipeId: number) => async () => {
    if (!session) return
    const response = await fetch(deleteUserFavoritesApi(recipeId), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const userFavorite = await response.json()
    console.log(userFavorite)
    setLoading(true)
  }

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
        <Link to="/home">
          <button>戻る</button>
        </Link>
      </div>
    </>
  )
}
