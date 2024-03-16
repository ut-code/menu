import { useState, useContext } from "react"

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

  const handleSubmit = () => {}

  // 「お気に入りにいれる」にデフォルトでチェックを入れる

  if (!session?.access_token) return <p>ログインしていません</p>
  return (
    <>
      <h1>NewRecipes</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">タイトル</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor="description">説明</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <label htmlFor="cookingTime">調理時間</label>
        <input type="number" value={cookingTime} onChange={(e) => setTotalCookingTime(e.target.value)} />
        <label htmlFor="ingredients">材料</label>
        <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        <label htmlFor="sourceUrl">URL</label>
        <input type="text" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
        <label htmlFor="foodImageUrl">料理画像URL</label>
        <input type="text" value={foodImageUrl} onChange={(e) => setFoodImageUrl(e.target.value)} />
        <label htmlFor="dish">料理の種類</label>
        <input type="text" value={dish} onChange={(e) => setDish(e.target.value)} />
        <button type="submit">投稿</button>
      </form>
    </>
  )
}
