import { useState, useEffect, useContext, Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

import { Loading } from "@/components/Loading"
import { Searchbox } from "@/components/Searchbox"
import { RecipeCard } from "@/components/RecipeCard"
import { BackButton } from "@/components/elements/button/BackButton"
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
import GridViewIcon from "@mui/icons-material/GridView"

export const Result = () => {
  const navigate = useNavigate()
  const { session } = useContext(UserContext)

  const [inputContent, setInputContent] = useState<string>("")
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
        body: JSON.stringify({
          materials: searchInfo.ingredients,
          dish: searchInfo.dish,
        }),
      })
      if (!response.ok) throw new Error("レシピの取得に失敗しました")
      const recipes: Recipe[] = await response.json()
      recipes.forEach((recipe) => {
        if (typeof recipe.materials === "string") {
          recipe.materials = JSON.parse(recipe.materials)
        }
      })
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

  if (isLoadingRecipes || isLoadingFavoriteRecipes) return <Loading />
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BackButton onClick={() => navigate("/questions")} />
        <Searchbox
          onClickHandler={onClickSearchRecipesKeywords}
          onChange={onChangeHandler}
          inputContent={inputContent}
          placeholder=""
        />
      </div>
      {recipes && recipes.length > 0 ? (
        <div className={styles.content}>
          <div className={styles.changeButton}>
            <button>
              <GridViewIcon style={{ width: 18, height: 18 }} />
              <h5>表示切り替え</h5>
            </button>
          </div>
          <div className={styles.cards}>
            {recipes.map((recipe) => (
              <Fragment key={recipe.id}>
                <RecipeCard recipe={recipe} favoriteRecipes={favoriteRecipes} toggleFavorite={toggleFavorite} />
              </Fragment>
            ))}
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
                  navigate("/questions")
                }}
              >
                <h3>もう一度検索する</h3>
              </button>
              <button className={styles.returnHome} onClick={() => navigate("/questions")}>
                <h3>ホームへ戻る</h3>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
