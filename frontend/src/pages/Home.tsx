import { useState, useEffect } from "react"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "@/assets/css/style.css"

// 人気レシピ4件を取得できるAPIから、必要なキーの情報のみを取得する
type recipe = {
  foodImageUrl: string
  mediumImageUrl: string
  recipeDescription: string
  recipeIndication: string
  recipeTitle: string
  recipeUrl: string
  recipeMaterial: string
}

export default function Home() {
  const [recipes, setRecipes] = useState<recipe[]>([])

  //----------------------------------------------------------------
  // 指定したカテゴリの人気レシピ上位4件を取得する。小カテゴリまで指定すれば十分な精度になるのでは？
  // 例として categoryId=18-189 の結果を表示している
  // res.jsonは{ "result": [] }の形式で返ってくる
  // 今回 recipe 型の配列に整形するため、 results の配列をループして recipe型 の配列に変換してから setRecipes する
  //----------------------------------------------------------------
  useEffect(() => {
    const fetchRecipes = async () => {
      const res: Response = await fetch(
        "https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=1032749498491273405&categoryId=18-189"
      )
      const datas = await res.json()
      const results = datas.result

      const tmps: recipe[] = []
      results.forEach((result: any) => {
        const tmp: recipe = result as recipe
        tmps.push(tmp)
      }, [])
      setRecipes(tmps)
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
      <Header />
      <ul>
        {recipes.map((recipe, index) => (
          <div key={index}>
            <li>{recipe.recipeTitle}</li>
          </div>
        ))}
      </ul>

      <a href="/question-1">Q1</a>
      <br></br>
      <a href="/question-2">Q2-4?</a>
      <br></br>
      <a href="/message">掲示板</a>
      <Footer />
    </>
  )
}
