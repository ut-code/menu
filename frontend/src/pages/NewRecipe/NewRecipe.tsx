import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { postSubmitRecipeApi, postScrapeRecipeApi } from "@/utils/apiUtils"
import { UserContext } from "@/utils/context"
import { Recipe } from "@/utils/recipes"

import styles from "./NewRecipe.module.css"
import { BorderButton } from "@/components/elements/button/BorderButton"
import { BackButton } from "@/components/elements/button/BackButton"
import { NextButton } from "@/components/elements/button/NextButton"
import { Loading } from "@/components/Loading"
import { InfoBox } from "@/components/InfoBox"
// import { TextField } from "@/components/TextField"
import { TextField } from "@mui/material"
import { RecipeCard } from "@/components/RecipeCard"
import GridViewIcon from "@mui/icons-material/GridView"

import emptyImage from "@/assets/image/Howto4.png"

type UIState = "URL" | "Detail"

export const NewRecipe = () => {
  const { session } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [uiState, setUiState] = useState<UIState>("URL")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [totalCookingTime, setTotalCookingTime] = useState<number>(-1)
  const [materialsConverted, setMaterialsConverted] = useState<string>("")
  const [sourceUrl, setSourceUrl] = useState<string>("")
  const [foodImageUrl, setFoodImageUrl] = useState<string>("")
  const [dish, setDish] = useState<string>("")

  const handleScrape = async () => {
    if (sourceUrl === "") {
      alert("URLを入力してください")
      return
    }
    if (!session?.access_token) return
    setIsLoading(true)
    const response = await fetch(postScrapeRecipeApi(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        sourceUrl: sourceUrl,
      }),
    })
    if (!response.ok) throw new Error("スクレイピングに失敗しました")
    const recipe: Recipe = await response.json()
    setTitle(recipe.title)
    setDescription(recipe.description)
    setTotalCookingTime(recipe.totalCookingTime)
    setMaterialsConverted(recipe.materials.join(","))
    setFoodImageUrl(recipe.foodImageUrl)
    setDish(recipe.dish)
    setIsLoading(false)
    setUiState("Detail")
  }

  const handleSubmit = async () => {
    if (!session?.access_token) return
    const response = await fetch(postSubmitRecipeApi(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        totalCookingTime: totalCookingTime,
        materials: materialsConverted.split(","),
        materialsConverted: materialsConverted,
        sourceUrl: sourceUrl,
        foodImageUrl: foodImageUrl,
        dish: dish,
      }),
    })
    if (!response.ok) throw new Error("レシピの投稿に失敗しました")
    alert("レシピを投稿しました")
    setTitle("")
    setDescription("")
    setTotalCookingTime(-1)
    setMaterialsConverted("")
    setSourceUrl("")
    setFoodImageUrl("")
    setDish("")
  }

  const navigate = useNavigate()
  // 「お気に入りにいれる」にデフォルトでチェックを入れる

  if (isLoading) return <Loading />
  if (!session?.access_token)
    return (
      <div className={styles.noResult}>
        <div className={styles.imageArea}>
          <img src={emptyImage} alt="empty" style={{ width: "300px" }} />
          <h4 className={styles.text}>だるめしにログインして作成機能を使ってみましょう</h4>
        </div>
        <BorderButton onClick={() => navigate("/Auth")} disabled={false}>
          <h4>ログインする</h4>
        </BorderButton>
      </div>
    )

  if (uiState === "URL")
    return (
      <>
        <div style={{ padding: "32px 16px" }}>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 32 }}>
            <TextField
              id="outlined-basic"
              label="レシピのURL"
              variant="outlined"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              style={{ width: "100%" }}
            />
            <InfoBox />
          </div>
          <NextButton title={"レシピを作成する"} onClick={handleScrape} disabled={false} />
        </div>
      </>
    )

  return (
    <div className={styles.createdContents}>
      <BackButton onClick={() => setUiState("URL")} />
      <div className={styles.titleArea}>
        <h1>作成内容</h1>
        <h5>作成するレシピの内容を確認・修正してください</h5>
      </div>

      <div className={styles.content}>
        <div className={styles.previewArea}>
          <div className={styles.buttonArea}>
            <h5 style={{ color: "#c4c4c4" }}>プレビュー</h5>
            <div className={styles.changeButton}>
              <button>
                <GridViewIcon style={{ width: 18, height: 18 }} />
                <h5>表示切り替え</h5>
              </button>
            </div>
          </div>
          <RecipeCard
            recipe={{
              id: 0, // Replace with the actual id value
              keywords: [], // Replace with the actual keywords value
              createdAt: "", // Replace with the actual createdAt value
              title: title,
              description: description,
              totalCookingTime: totalCookingTime,
              materials: materialsConverted.split(","),
              sourceUrl: sourceUrl,
              foodImageUrl: foodImageUrl,
              dish: dish,
            }}
            favoriteRecipes={[]} // Replace with the actual favoriteRecipes value
            toggleFavorite={() => {}} // Replace with the actual toggleFavorite value
          />
        </div>

        <div className={styles.editArea}>
          <TextField
            id="outlined-basic"
            label="料理画像URL"
            variant="outlined"
            value={foodImageUrl}
            onChange={(e) => setFoodImageUrl(e.target.value)}
            style={{ width: "100%" }}
          />
          <TextField
            id="outlined-basic"
            label="料理名"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
          />
          <TextField
            id="outlined-basic"
            label="材料"
            variant="outlined"
            value={materialsConverted}
            onChange={(e) => setMaterialsConverted(e.target.value)}
            style={{ width: "100%" }}
          />
          <select value={dish} onChange={(e) => setDish(e.target.value)}>
            <option value="主食">主食</option>
            <option value="主菜">主菜</option>
            <option value="副菜">副菜</option>
            <option value="スープ">スープ</option>
          </select>
          <TextField
            id="outlined-basic"
            label="調理時間"
            variant="outlined"
            value={totalCookingTime}
            onChange={(e) => setTotalCookingTime(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <NextButton title={"投稿する"} onClick={handleSubmit} disabled={false} />
    </div>
  )
}
