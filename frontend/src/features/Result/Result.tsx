import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import { Hamburger } from "@/components/Hamburger"
import { Head } from "@/components/Head"
import { Searchbox } from "@/components/Searchbox"
import { RecipeCard } from "./components/RecipeCard"
import { Recipe, Answers, SearchInfo, convertAnswersToSearchInfo } from "@/utils/recipes"
import { postSearchRecipesApi } from "@/utils/apiUtils"
import styles from "./Result.module.css"

export const Result = () => {
  // useNavigate を Navigate に変化させる呪文
  const Navigate = useNavigate()

  const [inputContent, setInputContent] = useState<string>("")
  const [runEffect, setRunEffect] = useState<boolean>(false)
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  // const queryClient = useQueryClient()

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

  const { data: recipes, isLoading } = useQuery({
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

  if (isLoading) return <p>レシピを読み込み中</p>
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
        {recipes && recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
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
