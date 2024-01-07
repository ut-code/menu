import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

import { Hamburger } from "@/components/Hamburger"
import { Head } from "@/components/Head"
import { Loading } from "@/components/Loading"
import { Searchbox } from "@/components/Searchbox"
import { RecipeCard } from "@/components/RecipeCard"
import {
  postSearchRecipesApi,
  postSearchRecipesKeywordsApi,
  getUserFavoritesApi,
  postUserFavoritesApi,
  deleteUserFavoritesApi,
} from "@/utils/apiUtils"
import { UserContext } from "@/utils/context"
import { Recipe, SearchInfo } from "@/utils/recipes"
import styles from "./Result.module.css"
import { EmptyResults } from "@/components/EmptyResults"

export const Result = () => {
  const Navigate = useNavigate()
  const { session } = useContext(UserContext)

  const [inputContent, setInputContent] = useState<string>("")
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const storedIngredients = localStorage.getItem("ingredients")
  const storedGenre = localStorage.getItem("genre")
  const storedCookingTime = localStorage.getItem("cookingTime")
  const searchInfo: SearchInfo = {
    ingredients: storedIngredients ? JSON.parse(storedIngredients) : [],
    dish: storedGenre ? JSON.parse(storedGenre) : null,
    cookingTime: storedCookingTime ? JSON.parse(storedCookingTime) : null,
  }

  useEffect(() => {
    // NOTE: searchInfo を空白区切りで連結したものをsetInputContent
    // 例: ["豚肉", "玉ねぎ", "にんにく"] -> "豚肉 玉ねぎ にんにく"
    setInputContent([...searchInfo.ingredients, searchInfo.dish, searchInfo.cookingTime].join(" "))
  }, [])

  const { data: recipes, isLoading: isLoadingRecipes } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await fetch(postSearchRecipesApi(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchInfo: searchInfo }),
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
  const addFavorite = useMutation({
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
  const deleteFavorite = useMutation({
    mutationFn: async (recipeId: number) => {
      if (!session?.access_token) return []
      const response = await fetch(deleteUserFavoritesApi(recipeId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) throw new Error("お気に入りの取得に失敗しました")
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
      deleteFavorite.mutate(recipeId)
    } else {
      addFavorite.mutate(recipeId)
    }
  }

  //----------------------------------------------------------------
  // フリーワード検索機能
  //----------------------------------------------------------------
  const searchRecipesKeywords = useMutation({
    mutationFn: async () => {
      const response = await fetch(postSearchRecipesKeywordsApi(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: inputContent }),
      })
      if (!response.ok) throw new Error("レシピの取得に失敗しました")
      const recipes: Recipe[] = await response.json()
      return recipes
    },
    onSuccess: (recipes) => {
      queryClient.setQueryData(["recipes"], recipes)
    },
  })

  const onClickSearchRecipesKeywords = () => {
    searchRecipesKeywords.mutate()
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value)
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isLoadingRecipes || isLoadingFavoriteRecipes) return <Loading />
  if (isOpenHamburger) return <Hamburger onClickCloseHamburger={onClickCloseHamburger} />
  return (
    <div className="style_lightbrown">
      <Head
        showBackButton={true}
        onClickPreviousPage={() => Navigate("/questions")}
        onClickOpenHamburger={onClickOpenHamburger}
      />
      <div className={styles.searchbox}>
        <Searchbox
          onClickHandler={onClickSearchRecipesKeywords}
          onChange={onChangeHandler}
          inputContent={inputContent}
          placeholder=""
        />
      </div>

      {recipes && recipes.length > 0 ? (
        <div className={styles.cards}>
          {recipes &&
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                favoriteRecipes={favoriteRecipes}
                toggleFavorite={toggleFavorite}
              />
            ))}
          <div className={styles.spacer} />

          <div className={styles.bottom}>
            <button className={styles.returnHome} onClick={() => Navigate("/home")}>
              ホームへ戻る
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.emptyResults}>
          <EmptyResults />
          <div className={styles.buttonBundle}>
            <div className={styles.links}>
              <button
                className={styles.returnSearch}
                onClick={() => {
                  Navigate("/questions")
                }}
              >
                もう一度検索する
              </button>
              <button className={styles.returnHome} onClick={() => Navigate("/home")}>
                ホームへ戻る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
