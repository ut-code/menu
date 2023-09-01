import { Link } from "react-router-dom"
import { Session } from "@supabase/supabase-js"

import { Recipe } from "@/utils/recipes"
import { getUserFavoritesApi, deleteUserFavoritesApi } from "@/utils/apiUtils"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

interface Props {
  session: Session | null
}

export const Favorite = ({ session }: Props) => {
  const queryClient = useQueryClient()

  const { data: favoriteRecipes, isLoading } = useQuery({
    queryKey: ["favoriteRecipes"],
    queryFn: async () => {
      const response = await fetch(getUserFavoritesApi(), {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) throw new Error("お気に入りの取得に失敗しました")
      const recipes: Recipe[] = await response.json()
      return recipes
    },
  })

  const onClickDeleteFavorite = useMutation({
    mutationFn: async (recipeId: number) => {
      if (!session) return
      const response = await fetch(deleteUserFavoritesApi(recipeId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const userFavorite = await response.json()
      console.log(userFavorite)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteRecipes"])
    },
  })

  if (isLoading) return <p>お気に入りを読み込み中</p>
  return (
    <>
      <div className="style_lightbrown">
        <h1>お気に入り</h1>
        {favoriteRecipes ? (
          <ul>
            {favoriteRecipes.map((recipe) => (
              <span key={recipe.id}>
                <li>{recipe.recipeTitle}</li>
                <button onClick={() => onClickDeleteFavorite.mutate(recipe.id)}>お気に入りから削除</button>
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
