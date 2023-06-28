import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import { BackButton } from "@/components/elements/button/BackButton"
import { InputIngredient } from "@/components/question/InputIngredient"
import { RecipeCard } from "@/components/result/RecipeCard"

const postSelectRecipeApi = `${import.meta.env.VITE_API_ENDPOINT}/searchRecipes`

// 人気レシピ4件を取得できるAPIから、必要なキーの情報のみを取得する
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

type Answer = {
  answerNumber: number
  content: string
}

// 検索に使用する情報 @@@@@
type SearchInfo = {
  ingredient: string[]
  time?: string
  dish?: string // 主菜・副菜など
  keywords?: string[]
}

export const Result = () => {
  // useNavigate を Navigate に変化させる呪文
  const Navigate = useNavigate()

  const [inputContent, setInputContent] = useState<string>("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const addRecipe = (recipe: Recipe) => setRecipes((prev) => [...prev, recipe])
  const [runEffect, setRunEffect] = useState<boolean>(false)

  const convertAnswersToSearchInfo = (answers: Answer[]): SearchInfo => {
    const info: SearchInfo = { ingredient: [] }
    if (answers) {
      answers.forEach((answer: Answer) => {
        // answer.contentをingredientに追加
        if (answer.answerNumber === 0) info.ingredient.push(answer.content)
        if (answer.answerNumber === 3) info.ingredient.push(answer.content)
      })
    }
    return info
  }

  // const convertInputContentToSearchInfo = (newInputContent: string): SearchInfo => {

  // localStorageに保存出来ているか確認
  // 無駄に unmounted で一回しか実行されないようにコントロール
  let unmounted = false
  useEffect(() => {
    // 二度実行しないようにflagを立てる
    if (unmounted) return
    unmounted = true

    // localStorageから解答を取り出してanswersに入れる
    const answers: Answer[] = []
    for (let i = 0; i < 4; i++) {
      const answer = localStorage.getItem("answer-" + i.toString())
      if (answer !== null) {
        answers.push({ answerNumber: i, content: answer })
      }
    }

    // inputContent の初期値を設定
    // answers を空白区切りで連結したものをsetInputContent
    // 例: ["豚肉", "玉ねぎ", "にんにく"] -> "豚肉 玉ねぎ にんにく"
    setInputContent(answers.map((answer) => answer.content).join(" "))

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

  useEffect(() => {
    if (!runEffect) return
    setRunEffect(false)

    // inputContentを使ったフリーワード検索を行う
    // じっくりなどの特定の単語なら、構造化検索も
    // const searchInfo: SearchInfo = convertInputContentToSearchInfo(inputContent)
    alert("フリーワード検索: " + inputContent)
  }, [runEffect])

  const onClickRunEffect = () => {
    setRunEffect(true)
  }

  //----------------------------------------------------------------
  // 入力欄に入れたときの処理
  //----------------------------------------------------------------
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value)
  }

  return (
    <>
      <div className="style_lightbrown" style={{ height: "auto" }}>
        <BackButton onClick={() => Navigate("/questions")} />

        <InputIngredient
          onClickResultPage={onClickRunEffect}
          onChange={onChangeHandler}
          inputContent={inputContent}
          placeholder=""
        />

        {recipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            recipeUrl={recipe.recipeUrl}
            foodImageUrl={recipe.foodImageUrls[0]}
            title={recipe.recipeTitle}
            material={recipe.recipeMaterialConverted}
          />
        ))}

        <Link to={"/home"}>
          <button>ホーム</button>
        </Link>
      </div>
    </>
  )
}
