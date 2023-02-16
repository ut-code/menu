import { useState, useEffect } from "react"

import "@/assets/css/style.css"
import "@/assets/css/card.css"

// 人気レシピ4件を取得できるAPIから、必要なキーの情報のみを取得する
type recipe = {
  foodImageUrl: string
  mediumImageUrl: string
  recipeDescription: string
  recipeIndication: string
  recipeTitle: string
  recipeUrl: string
  recipeMaterial: string[]
  recipeMaterialConverted: string
}

// 二回マウントするので8個表示されるけど気にしない
const answers: string[] = []

export default function Result() {
  // localStorageに保存出来ているか確認
  useEffect(() => {
    for (let i = 0; i < 4; i++) {
      const answer = localStorage.getItem("answer-" + i.toString())
      if (answer !== null) {
        answers.push(answer)
      }
    }
  }, [])

  const [categoryId, setCategoryId] = useState<string>("12-102")
  const [recipes, setRecipes] = useState<recipe[]>([])

  const addRecipe = (recipe: recipe) => setRecipes((prev) => [...prev, recipe])

  //----------------------------------------------------------------
  // 指定したカテゴリの人気レシピ上位4件を取得する。小カテゴリまで指定すれば十分な精度になるのでは？
  // 例として categoryId=18-189 の結果を表示している
  // res.jsonは{ "result": [] }の形式で返ってくる
  // 今回 recipe 型の配列に整形するため、 results の配列をループして recipe型 の配列に変換してから addRecipe する
  //----------------------------------------------------------------
  useEffect(() => {
    const fetchRecipes = async () => {
      const res: Response = await fetch(
        "https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=1032749498491273405&categoryId=" +
          categoryId
      )
      const datas = await res.json()
      const results = datas.result

      results.forEach((result: object) => {
        // resultの型はrecipeより拡張されているから、recipe型に変換する
        // tmp: recipe = ...と明示的に書いてみた
        const tmp: recipe = result as recipe

        // recipeMaterialConverted は、recipeMaterial の配列を"・"で連結したもの
        // 例: ["豚肉", "玉ねぎ", "にんにく"] -> "豚肉・玉ねぎ・にんにく"
        tmp.recipeMaterialConverted = tmp.recipeMaterial.join("・")
        addRecipe(tmp)
      }, [])
    }

    fetchRecipes()
    /*
    詰まった箇所のメモ
    await res.json()で受け取ったjsonの形式を調べるために、Object.keys()とObject.values()を使用
    しかし、本来はリンク先の情報を見ればわかることだった
    */
  }, [])

  return (
    <>
      <div className="style1">
        <div className="backButton">＜</div>
        <div className="result">検索結果</div>
        {recipes.map((recipe, index) => (
          <div key={index} className="card">
            <img className="card__imgframe" src={recipe.foodImageUrl} />
            <div className="card__textbox">
              <div className="card__titletext">{recipe.recipeTitle}</div>
              <div className="card__overviewtext">{recipe.recipeMaterialConverted}</div>
            </div>
          </div>
        ))}

        <a href="/home">ホーム</a>
        {answers.map((answer, index) => (
          <div key={index}>
            {index + 1}
            {answer}
          </div>
        ))}
      </div>
    </>
  )
}
