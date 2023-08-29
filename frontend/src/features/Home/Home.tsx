import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Recipe, getUserFavoritesApi, postUserFavoritesApi } from "@/utils/recipes"

interface Props {
  userId: string | undefined
}

export const Home = (props: Props) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const [tmp, setTmp] = useState<number>(0)
  const [runEffect, setRunEffect] = useState<boolean>(false)

  // 永続的に残るので、localStorageから問題への回答を消しておく
  useEffect(() => {
    localStorage.removeItem("ingredients")
    localStorage.removeItem("genre")
    localStorage.removeItem("cookingTime")
  }, [])

  useEffect(() => {
    const fetchUserFavorites = async (userId: string) => {
      const response = await fetch(getUserFavoritesApi(userId))
      const favorites = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recipes = favorites.map((favorite: any) => favorite.favoriteRecipe)
      try {
        setFavoriteRecipes(recipes)
        console.log(recipes)
      } catch (error) {
        console.log(error)
      }
    }

    if (props.userId) {
      fetchUserFavorites(props.userId)
    }
  }, [runEffect])

  const onClickAddFavorite = (recipeId: number) => async () => {
    const response = await fetch(postUserFavoritesApi(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: props.userId, recipeId: recipeId }),
    })
    const userFavorite = await response.json()
    console.log(userFavorite)
    setRunEffect((prev) => !prev)
  }

  return (
    <>
      <div className="style_lightbrown">
        <Link to={"/questions"}>
          <button>はじめる</button>
        </Link>
        <br></br>
        <Link to={"/result"}>
          <button>検索結果</button>
        </Link>
        <br></br>
        <input onChange={(e) => setTmp(Number(e.target.value))} type="number" />
        <button onClick={onClickAddFavorite(tmp)} type="submit">
          お気に入りに追加
        </button>
        <ul>
          {favoriteRecipes.map((recipe) => (
            <li key={recipe.id}>{recipe.recipeTitle}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
