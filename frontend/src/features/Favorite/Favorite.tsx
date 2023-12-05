import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Session } from "@supabase/supabase-js"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

import { getUserFavoritesApi, postUserFavoritesApi, deleteUserFavoritesApi } from "@/utils/apiUtils"
import { Recipe } from "@/utils/recipes"
import { Head } from "@/components/Head"
import { Loading } from "@/components/Loading"
import { RecipeCard } from "@/components/RecipeCard"
import { Hamburger } from "@/components/Hamburger"
import styles from "./Favorite.module.css"

interface Props {
  session: Session | null
}

export const Favorite = ({ session }: Props) => {
  const queryClient = useQueryClient()
  const Navigate = useNavigate()

  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  const [initialFavoriteRecipes, setInitialFavoriteRecipes] = useState<Recipe[]>([])

  // NOTE: コードの再利用性は悪いが、こうするしかなかった…
  useEffect(() => {
    if (!session) return
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
        <div className={styles.genre_buttons}>
          <button className={styles.genre_button}>主食</button>
          <button className={styles.genre_button}>主菜</button>
          <button className={styles.genre_button}>副菜</button>
          <button className={styles.genre_button}>スープ</button>
        </div>
      </div>
      <div className={styles.cards}>
        {initialFavoriteRecipes ? (
          initialFavoriteRecipes.map((recipe) => (
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
