import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Session } from "@supabase/supabase-js"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

import { getUserFavoritesApi, postUserFavoritesApi, deleteUserFavoritesApi } from "@/utils/apiUtils"
import { Hamburger } from "@/components/Hamburger"
import { Head } from "@/components/Head"
import { Searchbox } from "@/components/Searchbox"
import { RecipeCard } from "./components/RecipeCard"
import { Recipe, Answers, SearchInfo, convertAnswersToSearchInfo } from "@/utils/recipes"
import { postSearchRecipesApi } from "@/utils/apiUtils"
import styles from "./Result.module.css"

interface Props {
  session: Session | null
}

export const Result = ({ session }: Props) => {
  const Navigate = useNavigate()

  const [inputContent, setInputContent] = useState<string>("")
  const [runEffect, setRunEffect] = useState<boolean>(false)
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const answers: Answers = {
    ingredients: JSON.parse(localStorage.getItem("ingredients") || "[]"),
    genre: localStorage.getItem("genre") || "",
    cookingTime: localStorage.getItem("cookingTime") || "",
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
      onClickDeleteFavorite.mutate(recipeId)
    } else {
      onClickAddFavorite.mutate(recipeId)
    }
  }

  //----------------------------------------------------------------
  // フリーワード検索機能
  //----------------------------------------------------------------
  const convertInputContentToSearchInfo = (newInputContent: string): SearchInfo => {
    // inputContentを使ったフリーワード検索を行う
    const info: SearchInfo = { ingredients: [], keywords: [] }
    // newInputContentを空白区切りで配列にする
    const searchWords: string[] = newInputContent.split(" ")

    if (searchWords) {
      searchWords.forEach((word: string) => {
        // wordをkeywordsに追加
        info.keywords.push(word)
      })
    }
    return info
  }

  useEffect(() => {
    if (!runEffect) return
    setRunEffect(false)

    const searchInfo: SearchInfo = convertInputContentToSearchInfo(inputContent)
    alert("フリーワード検索: " + searchInfo.keywords)
  }, [runEffect])

  const onClickRunEffect = () => setRunEffect(true)

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value)
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isLoadingRecipes || isLoadingFavoriteRecipes) return <p>レシピを読み込み中</p>
  return (
    <div className="style_lightbrown">
      <Head
        showBackButton={true}
        onClickPreviousPage={() => Navigate("/questions")}
        onClickOpenHamburger={onClickOpenHamburger}
      />
      <div className={styles.searchbox}>
        <Searchbox
          onClickHandler={onClickRunEffect}
          onChange={onChangeHandler}
          inputContent={inputContent}
          placeholder=""
        />
      </div>
      {isOpenHamburger === true && <Hamburger onClickCloseHamburger={onClickCloseHamburger} />}

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
      </div>

      <div className={styles.spacer} />

      <div className={styles.bottom}>
        <button className={styles.return} onClick={() => Navigate("/home")}>
          ホームに戻る
        </button>
      </div>
    </div>
  )
}
