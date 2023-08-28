import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import { Hamburger } from "@/components/Hamburger"
import { Head } from "@/components/Head"
import { Searchbox } from "@/components/Searchbox"
import { RecipeCard } from "./components/RecipeCard"

const postSelectRecipeApi = `${import.meta.env.VITE_API_ENDPOINT}/searchRecipes`

type Recipe = {
  id: number
  recipeTitle: string
  recipeUrl: string
  recipeDescription: string
  foodImageUrls: string[]
  keywords: string[]
  totalTime: number
  recipeMaterial: string[]
  recipeMaterialConverted: string
}

type Answers = {
  ingredients: string[]
  genre: string
  cookingTime: string
}

type SearchInfo = {
  ingredients: string[]
  time?: string
  dish?: string // 主菜・副菜など
  keywords: string[]
}

export const Result = () => {
  // useNavigate を Navigate に変化させる呪文
  const Navigate = useNavigate()

  const [inputContent, setInputContent] = useState<string>("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const addRecipe = (recipe: Recipe) => setRecipes((prev) => [...prev, recipe])
  const [runEffect, setRunEffect] = useState<boolean>(false)
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)

  const convertAnswersToSearchInfo = (answers: Answers): SearchInfo => {
    const info: SearchInfo = { ingredients: [], keywords: [] }
    if (answers) {
      info.ingredients = answers.ingredients
    }
    return info
  }

  // 無駄に unmounted で一回しか実行されないようにコントロール
  let unmounted = false
  useEffect(() => {
    if (unmounted) return
    unmounted = true

    // localStorageから解答を取り出してanswersに入れる
    const answers: Answers = {
      ingredients: JSON.parse(localStorage.getItem("ingredients") || "[]"),
      genre: localStorage.getItem("genre") || "",
      cookingTime: localStorage.getItem("cookingTime") || "",
    }

    // inputContent の初期値を設定
    // answers を空白区切りで連結したものをsetInputContent
    // 例: ["豚肉", "玉ねぎ", "にんにく"] -> "豚肉 玉ねぎ にんにく"
    setInputContent([...answers.ingredients, answers.genre, answers.cookingTime].join(" "))

    // answers をfindManyの検索に使いやすいように searchInfo に整形
    const searchInfo: SearchInfo = convertAnswersToSearchInfo(answers)

    // searchInfo を使ってfetchAPI
    const fetchSearchedRecipes = async (info: SearchInfo) => {
      // searchInfo を載せてPOSTリクエスト、返ってきた内容がresponse
      const response = await fetch(postSelectRecipeApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: info }),
      })
      const results = await response.json()
      console.log(results)

      // undefinedエラー回避
      if (results) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        results.forEach((result: any) => {
          // result の型は欠損あり Recipe なので any型 で受けて、 Recipe型 に変換する
          // recipeMaterialConverted は、 recipeMaterial の配列を "・" で連結したもの
          // 例: ["豚肉", "玉ねぎ", "にんにく"] -> "豚肉・玉ねぎ・にんにく"
          result.recipeMaterialConverted = result.recipeMaterial.join("・")
          addRecipe(result)
        })
      }
    }

    fetchSearchedRecipes(searchInfo)
  }, [])

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

  return (
    <>
      <div className="style_lightbrown">
        <div style={{ width: "100%", margin: "0 0 0.8em 0" }}>
          <Head
            showBackButton={true}
            onClickPreviousPage={() => Navigate("/questions")}
            onClickOpenHamburger={onClickOpenHamburger}
          />

          <Searchbox
            onClickHandler={onClickRunEffect}
            onChange={onChangeHandler}
            inputContent={inputContent}
            placeholder=""
          />
        </div>

        {isOpenHamburger === true && <Hamburger onClickCloseHamburger={onClickCloseHamburger} />}

        <div
          style={{
            height: "auto",
            position: "relative",
            zIndex: -1,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipeUrl={recipe.recipeUrl}
              foodImageUrl={recipe.foodImageUrls[0]}
              title={recipe.recipeTitle}
              material={recipe.recipeMaterialConverted}
            />
          ))}
        </div>
      </div>
    </>
  )
}
