import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

import {
  postSearchRecipesKeywordsApi,
  getUserFavoritesApi,
  postUserFavoritesApi,
  deleteUserFavoritesApi,
} from "@/utils/apiUtils"
import { UserContext } from "@/utils/context"
import { Recipe } from "@/utils/recipes"
import { Head } from "@/components/Head"
import { RecipeCard } from "@/components/RecipeCard"
import { Hamburger } from "@/components/Hamburger"
import styles from "./Seasonal.module.css"

export const Seasonal = () => {
  const queryClient = useQueryClient()
  const Navigate = useNavigate()
  const { session } = useContext(UserContext)

  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)

  const { data: seasonalRecipes, isLoading: isLoadingSeasonalRecipes } = useQuery({
    queryKey: ["seasonalRecipes"],
    queryFn: async () => {
      const response = await fetch(postSearchRecipesKeywordsApi(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: "夏" }),
      })
      if (!response.ok) throw new Error("レシピの取得に失敗しました")
      const recipes: Recipe[] = await response.json()
      return recipes
    },
  })

  // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
  const { data: favoriteRecipes, isLoading: isLoadingFavoriteRecipes } = useQuery({
    queryKey: ["favoriteRecipes"],
    queryFn: async () => {
      if (!session?.access_token) return []
      const response = await fetch(getUserFavoritesApi(), {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) throw new Error("お気に入りの取得に失敗しました")
      const recipes: Recipe[] = await response.json()
      return recipes
    },
  })

  // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
  const onClickAddFavorite = useMutation({
    mutationFn: async (recipeId: number) => {
      if (!session?.access_token) return []
      const response = await fetch(postUserFavoritesApi(), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ recipeId: recipeId }),
      })
      if (!response.ok) throw new Error("お気に入りの追加に失敗しました")
      const userFavorite = await response.json()
      console.log(userFavorite)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteRecipes"])
    },
  })

  // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
  const onClickDeleteFavorite = useMutation({
    mutationFn: async (recipeId: number) => {
      if (!session?.access_token) return []
      const response = await fetch(deleteUserFavoritesApi(recipeId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) throw new Error("お気に入りの削除に失敗しました")
      const userFavorite = await response.json()
      console.log(userFavorite)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteRecipes"])
    },
  })

  const toggleFavorite = (recipeId: number) => {
    if (!favoriteRecipes) return
    if (favoriteRecipes.some((recipe) => recipe.id === recipeId)) {
      onClickDeleteFavorite.mutate(recipeId)
    } else {
      onClickAddFavorite.mutate(recipeId)
    }
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isLoadingSeasonalRecipes || isLoadingFavoriteRecipes) return <p>レシピを読み込み中</p>
  if (isOpenHamburger) return <Hamburger onClickCloseHamburger={onClickCloseHamburger} />
  return (
    <div className="style_lightbrown">
      <Head
        showBackButton={true}
        onClickPreviousPage={() => Navigate("/home")}
        onClickOpenHamburger={onClickOpenHamburger}
      />

      <h2 style={{ margin: "20px 0" }}>季節のレシピ</h2>
      <div className={styles.cards}>
        {seasonalRecipes &&
          seasonalRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favoriteRecipes={favoriteRecipes}
              toggleFavorite={toggleFavorite}
              session={session}
            />
          ))}
      </div>
    </div>
  )
}
