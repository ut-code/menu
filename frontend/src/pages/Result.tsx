import { useState, useEffect } from "react"

import "@/assets/css/style.css"
import "@/assets/css/home.css"
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
}

export default function Result() {
  const [categoryId, setCategoryId] = useState<string>("37-498-1677")
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
        <a href="/home">ホーム</a>
        <div className="backButton">＜</div>
        <div className="result">検索結果</div>
        <div className="card">
          {recipes.map((recipe, index) => (
            <div key={index}>
              <div className="card__imgframe">
                <img src={recipe.foodImageUrl} />
              </div>
              <div className="card__textbox">
                <div className="card__titletext">{recipe.recipeTitle}</div>
                <div className="card__overviewtext">
                  {/* show each element of the list recipeMaterial */}
                  {recipe.recipeMaterial.map((material, index) => (
                    <div key={index}>{material}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
