import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Session } from "@supabase/supabase-js"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

import { Hamburger } from "@/components/Hamburger"
import { Head } from "@/components/Head"
import { Loading } from "@/components/Loading"
import { Searchbox } from "@/components/Searchbox"
import { RecipeCard } from "@/components/RecipeCard"
import { Recipe, Answers, SearchInfo, convertAnswersToSearchInfo } from "@/utils/recipes"
import {
  postSearchRecipesApi,
  postSearchRecipesKeywordsApi,
  getUserFavoritesApi,
  postUserFavoritesApi,
  deleteUserFavoritesApi,
} from "@/utils/apiUtils"
import styles from "./Result.module.css"
import { EmptyResults } from "@/components/EmptyResults"

interface Props {
  session: Session | null
}

export const Result = ({ session }: Props) => {
  const Navigate = useNavigate()

  const [inputContent, setInputContent] = useState<string>("")
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const answers: Answers = {
    ingredients: JSON.parse(localStorage.getItem("ingredients") || "[]"),
    genre: JSON.parse(localStorage.getItem("genre") || ""),
    cookingTime: JSON.parse(localStorage.getItem("cookingTime") || ""),
  }
  // answers をfindManyの検索に使いやすいように searchInfo に整形
  const searchInfo: SearchInfo = convertAnswersToSearchInfo(answers)

  useEffect(() => {
    // answers を空白区切りで連結したものをsetInputContent
    // 例: ["豚肉", "玉ねぎ", "にんにく"] -> "豚肉 玉ねぎ にんにく"
    setInputContent([...answers.ingredients, answers.genre, answers.cookingTime].join(" "))
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
  const convertInputContentToSearchInfo = (newInputContent: string) => {
    return { keywords: newInputContent.split(" ") }
  }

  const searchRecipesKeywords = useMutation({
    mutationFn: async () => {
      const response = await fetch(postSearchRecipesKeywordsApi(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(convertInputContentToSearchInfo(inputContent)),
      })
      console.log(convertInputContentToSearchInfo(inputContent))
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
  if (isOpenHamburger) return <Hamburger session={session} onClickCloseHamburger={onClickCloseHamburger} />
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
                session={session}
              />
            ))}
          <div className={styles.spacer} />

          <div className={styles.bottom}>
            <button className={styles.returnHome} onClick={() => Navigate("/home")}>
              ホームに戻る
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
            </div>
            <div className={styles.links}>
              <button className={styles.returnHome} onClick={() => Navigate("/home")}>
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
