import { useState, useContext } from "react"

import { postSubmitRecipeApi, postScrapeRecipeApi } from "@/utils/apiUtils"
import { UserContext } from "@/utils/context"
import { Recipe } from "@/utils/recipes"

export const NewRecipes = () => {
  const { session } = useContext(UserContext)
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
    return
  }

  // 「お気に入りにいれる」にデフォルトでチェックを入れる

  if (!session?.access_token) return <p>ログインしていません</p>
  return (
    <>
      <h1>NewRecipes</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="sourceUrl">URL</label>
        <input type="text" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
        <button type="button" onClick={handleScrape}>
          自動スクレイピング
        </button>
        <br />
        <label htmlFor="title">タイトル</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <br />
        <label htmlFor="description">説明</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <br />
        <label htmlFor="cookingTime">調理時間</label>
        <input type="number" value={totalCookingTime} onChange={(e) => setTotalCookingTime(Number(e.target.value))} />
        <br />
        <label htmlFor="materials">材料</label>
        <input type="text" value={materialsConverted} onChange={(e) => setMaterialsConverted(e.target.value)} />
        <br />
        <label htmlFor="foodImageUrl">料理画像URL</label>
        <input type="text" value={foodImageUrl} onChange={(e) => setFoodImageUrl(e.target.value)} />
        <br />
        <img src={foodImageUrl} alt="料理画像" />
        <br />
        <label htmlFor="dish">料理の種類</label>
        <select value={dish} onChange={(e) => setDish(e.target.value)}>
          <option value="主食">主食</option>
          <option value="主菜">主菜</option>
          <option value="副菜">副菜</option>
          <option value="スープ">スープ</option>
        </select>
        <br />
        <button type="submit">投稿</button>
      </form>
    </>
  )
}
