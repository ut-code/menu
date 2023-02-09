import { useState, useEffect } from "react"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "@/assets/css/style.css"

const rakutenApiTest =
  "https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=1032749498491273405"

// type rakutenRecipeCategory = { categoryId: number, categoryName: string, categoryUrl: string, parentCategoryId: string }

export default function Home() {
  // const [recipes, setRecipes] = useState<rakutenRecipeCategory[]>([])

  // async fetch recipes through rakutenApiTest using fetchapi
  // useEffect(() => {
  //   const timerId = setInterval(async () => {
  //     const response = await fetch(rakutenApiTest)
  //     const data = await response.json()
  //     console.log(data)
  //     // setRecipes(data)
  //   }, 1000 * 10)

  //   // useEffect フックに指定した関数の戻り値に指定した関数はコンポーネントの破棄時に実行される
  //   return () => {
  //     clearInterval(timerId)
  //   }
  // }, [])

  // useEffect(() => {
  //   async () => {
  //     const response = await fetch(rakutenApiTest)
  //     setRecipe(await response.json())
  //     console.log(recipe)
  //   }()
  // }, [])

  return (
    <>
      <Header />
      <ul>
        {/* {recipes.map((recipe) => (
          <li key={recipe.categoryId}>{recipe.categoryName}</li>
        ))} */}
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
