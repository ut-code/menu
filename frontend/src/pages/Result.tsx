import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"

import FadeIn from "@/components/FadeIn"
import "@/assets/css/style.css"
import "@/assets/css/home.css"
import "@/assets/css/card.css"

import { BsArrowLeft } from "react-icons/bs"
import Reference from "@/components/reference"

const postSelectRecipeApi = `${import.meta.env.VITE_API_ENDPOINT}/searchRecipes`

// 人気レシピ4件を取得できるAPIから、必要なキーの情報のみを取得する
type Recipe = {
  recipeTitle: string
  recipeUrl: string
  recipeDescription: string
  foodImageUrls: string[]
  keywords: string[]
  totalTime: number
  recipeMaterial: string[]
  recipeMaterialConverted: string
}

// 二回マウントするので8個表示されるけど気にしない
type Answer = {
  answerNumber: number
  content: string
}

// 検索に使用する情報 @@@@@
type SearchInfo = {
  ingredient: string[]
  // あとで増やす
}

export default function Result() {
  // useNavigate を Navigate に変化させる呪文
  const Navigate = useNavigate()

  const [answers, setAnswers] = useState<Answer[]>([])
  // const addAnswer = (answer: Answer) => setAnswers((prev) => [...prev, answer])
  // const [categoryId, setCategoryId] = useState<string>("12-103")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const addRecipe = (recipe: Recipe) => setRecipes((prev) => [...prev, recipe])

  const convertAnswersToSearchInfo = (newAnswers: Answer[]): SearchInfo => {
    //
    const info: SearchInfo = { ingredient: [] }
    if (newAnswers) {
      newAnswers.forEach((answer: Answer) => {
        // answer.contentをingredientに追加
        if (answer.answerNumber === 0) {
          info.ingredient.push(answer.content)
        }
      })
    }
    return info
  }

  // localStorageに保存出来ているか確認
  // 無駄に unmounted で一回しか実行されないようにコントロール
  let unmounted = false
  useEffect(() => {
    // 二度実行しないようにflagを立てる
    if (unmounted) return
    unmounted = true

    // localStorageから解答を取り出してanswersに入れる
    const newAnswers: Answer[] = []
    for (let i = 0; i < 4; i++) {
      const answer = localStorage.getItem("answer-" + i.toString())
      if (answer !== null) {
        // addAnswer({ answerNumber: i, content: answer })
        newAnswers.push({ answerNumber: i, content: answer })
      }
    }
    setAnswers(newAnswers)

    // newAnswers をfindManyの検索に使いやすいように searchInfo に整形
    const searchInfo: SearchInfo = convertAnswersToSearchInfo(newAnswers)

    // searchInfo を使ってfetchAPI
    const fetchSearchedRecipes = async (info: SearchInfo) => {
      // searchInfo を載せてPOSTリクエスト、返ってきた内容がresponse
      const response = await fetch(postSelectRecipeApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: info }),
      })
      const results = await response.json()

      // undefinedエラー回避
      if (results) {
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
  // 指定したカテゴリの人気レシピ上位4件を取得する。小カテゴリまで指定すれば十分な精度になるのでは？
  // 例として categoryId=18-189 の結果を表示している
  // res.jsonは{ "result": [] }の形式で返ってくる
  // 今回 Recipe 型の配列に整形するため、 results の配列をループして recipe型 の配列に変換してから addRecipe する
  //----------------------------------------------------------------
  // useEffect(() => {
  //   const fetchRecipes = async (categoryId: string) => {
  //     const response: Response = await fetch(
  //       "https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=1032749498491273405&categoryId=" +
  //         categoryId
  //     )
  //     const datas = await response.json()
  //     const results = datas.result

  //     if (results) {
  //       // undefinedエラー回避
  //       results.forEach((result: any) => {
  //         // resultの型はrecipeより拡張されているから、recipe型に変換する
  //         // tmp: recipe = ...と明示的に書いてみた
  //         const tmp: Recipe = result as Recipe

  //         // recipeMaterialConverted は、recipeMaterial の配列を"・"で連結したもの
  //         // 例: ["豚肉", "玉ねぎ", "にんにく"] -> "豚肉・玉ねぎ・にんにく"
  //         tmp.recipeMaterialConverted = tmp.recipeMaterial.join("・")
  //         tmp.foodImageUrls = [result.foodImageUrl]
  //         tmp.totalTime = 30
  //         // console.log(result)
  //         console.log(tmp)
  //         addRecipe(tmp)
  //       })
  //     }
  //   }

  //   fetchRecipes(categoryId)
  //   /*
  //   詰まった箇所のメモ
  //   await res.json()で受け取ったjsonの形式を調べるために、Object.keys()とObject.values()を使用
  //   しかし、本来はリンク先の情報を見ればわかることだった
  //   */
  // }, [])

  const controls = useAnimation()
  useEffect(() => {
    FadeIn({ controls })
  }, [])

  return (
    <>
      <motion.div animate={controls}>
        <div className="style1">
          <div className="backButton-b" onClick={() => Navigate("/questions")}>
            <BsArrowLeft size="1.2rem" color="white" />
          </div>
          <div className="inputIngredient" color="var(--Gray)">
            入力されたキーワード:
            {answers.map((answer, index) => (
              <span key={index}>{answer.content}</span>
            ))}
          </div>
          {recipes.map((recipe, index) => (
            <div key={index} className="card">
              {/* click anywhere and it opens recipe.recipeUrl but you don't make texts blue with underline */}
              <a href={recipe.recipeUrl} target="_blank" rel="noreferrer">
                <img className="card__imgframe" src={recipe.foodImageUrls[0]} />
                <div className="card__textbox">
                  <div className="card__titletext">{recipe.recipeTitle}</div>
                  <div className="card__overviewtext">{recipe.recipeMaterialConverted}</div>
                  <Reference url={recipe.recipeUrl} />
                </div>
              </a>
            </div>
          ))}

          <Link to={"/home"}>ホーム ←ボタンになってます</Link>
        </div>
      </motion.div>
    </>
  )
}
