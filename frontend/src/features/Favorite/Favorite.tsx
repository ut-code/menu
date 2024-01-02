import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

import { getUserFavoritesApi, postUserFavoritesApi, deleteUserFavoritesApi } from "@/utils/apiUtils"
import { UserContext } from "@/utils/context"
import { Recipe } from "@/utils/recipes"
import { Head } from "@/components/Head"
import { Loading } from "@/components/Loading"
import { RecipeCard } from "@/components/RecipeCard"
import { Hamburger } from "@/components/Hamburger"
import styles from "./Favorite.module.css"

export const Favorite = () => {
  const queryClient = useQueryClient()
  const Navigate = useNavigate()
  const { session } = useContext(UserContext)

  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  const [initialFavoriteRecipes, setInitialFavoriteRecipes] = useState<Recipe[]>([])
  const [filterStapleFood, setFilterStapleFood] = useState<boolean>(false)
  const [filterMainDish, setFilterMainDish] = useState<boolean>(false)
  const [filterSideDish, setFilterSideDish] = useState<boolean>(false)
  const [filterSoup, setFilterSoup] = useState<boolean>(false)

  const recipes = initialFavoriteRecipes.filter((recipe) => {
    if (!filterStapleFood && !filterMainDish && !filterSideDish && !filterSoup) return true
    // NOTE: OR条件でfilterをかける
    if (filterStapleFood && recipe.dish === "主食") return true
    if (filterMainDish && recipe.dish === "主菜") return true
    if (filterSideDish && recipe.dish === "副菜") return true
    if (filterSoup && recipe.dish === "スープ") return true
    return false
  })

  // NOTE: コードの再利用性は悪いが、こうするしかなかった…
  useEffect(() => {
    if (!session?.access_token) return
    const fetchFavoriteRecipes = async () => {
      const response = await fetch(getUserFavoritesApi(), {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) throw new Error("お気に入りの取得に失敗しました")
      const recipes: Recipe[] = await response.json()
      setInitialFavoriteRecipes(recipes)
    }
    fetchFavoriteRecipes()
  }, [])

  // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
  const { data: favoriteRecipes, isLoading } = useQuery({
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

  if (isLoading) return <Loading />
  if (isOpenHamburger) return <Hamburger onClickCloseHamburger={onClickCloseHamburger} />
  return (
    <div className="style_lightbrown">
      <Head
        showBackButton={true}
        onClickPreviousPage={() => Navigate("/home")}
        onClickOpenHamburger={onClickOpenHamburger}
      />

      <h2 style={{ margin: "20px 0" }}>お気に入り</h2>
      <div className={styles.buttons}>
        <div className={styles.sort_buttons}>
          <button className={styles.sort_button}>新しい順に並び替える</button>
        </div>
        <div className={styles.dish_buttons}>
          <div key="主食">
            <input
              type="checkbox"
              className={styles.dish_button}
              onChange={() => setFilterStapleFood((f) => !f)}
              checked={filterStapleFood}
            />
            <label htmlFor="主食">主食</label>
          </div>
          <div key="主菜">
            <input
              type="checkbox"
              className={styles.dish_button}
              onChange={() => setFilterMainDish((f) => !f)}
              checked={filterMainDish}
            />
            <label htmlFor="主菜">主菜</label>
          </div>
          <div key="副菜">
            <input
              type="checkbox"
              className={styles.dish_button}
              onChange={() => setFilterSideDish((f) => !f)}
              checked={filterSideDish}
            />
            <label htmlFor="副菜">副菜</label>
          </div>
          <div key="スープ">
            <input
              type="checkbox"
              className={styles.dish_button}
              onChange={() => setFilterSoup((f) => !f)}
              checked={filterSoup}
            />
            <label htmlFor="スープ">スープ</label>
          </div>
        </div>
      </div>
      <div className={styles.cards}>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favoriteRecipes={favoriteRecipes}
              toggleFavorite={toggleFavorite}
              session={session}
            />
          ))
        ) : (
          // TODO: サインインしてないときに表示を変える
          <p>お気に入りはまだありません。ハートボタンを押して追加してみましょう。</p>
        )}
      </div>
    </div>
  )
}
