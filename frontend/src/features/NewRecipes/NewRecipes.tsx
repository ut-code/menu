import { useState, useContext } from "react"

import { postRecipeApi } from "@/utils/apiUtils"
import { UserContext } from "@/utils/context"

export const NewRecipes = () => {
  const { session } = useContext(UserContext)
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [cookingTime, setTotalCookingTime] = useState<string>("")
  const [ingredients, setIngredients] = useState<string>("")
  const [sourceUrl, setSourceUrl] = useState<string>("")
  const [foodImageUrl, setFoodImageUrl] = useState<string>("")
  const [dish, setDish] = useState<string>("")

  const handleSubmit = async () => {
    if (!session?.access_token) return
    const response = await fetch(postRecipeApi(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        totalCookingTime: cookingTime,
        materials: ingredients,
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
        <br />
        <label htmlFor="title">タイトル</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <br />
        <label htmlFor="description">説明</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <br />
        <label htmlFor="cookingTime">調理時間</label>
        <input type="number" value={cookingTime} onChange={(e) => setTotalCookingTime(e.target.value)} />
        <br />
        <label htmlFor="ingredients">材料</label>
        <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        <br />
        <label htmlFor="foodImageUrl">料理画像URL</label>
        <input type="text" value={foodImageUrl} onChange={(e) => setFoodImageUrl(e.target.value)} />
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
