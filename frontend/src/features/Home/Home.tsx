import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Recipe, SearchInfo, getUserFavoritesApi } from "@/utils/recipes"
// import { RecipeCardMedium } from "./components/RecipeCardMedium"

interface Props {
  userId: string | undefined
}

export const Home = (props: Props) => {
  const [favorites, setFavorites] = useState<Recipe[]>([])

  // 永続的に残るので、localStorageから問題への回答を消しておく
  useEffect(() => {
    localStorage.removeItem("ingredients")
    localStorage.removeItem("genre")
    localStorage.removeItem("cookingTime")
  }, [])

  useEffect(() => {
    const fetchUserFavorites = async (userId: string, info: SearchInfo) => {
      const response = await fetch(getUserFavoritesApi(userId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: info }),
      })
      const recipes: Recipe[] = await response.json()
      try {
        setFavorites(recipes)
        console.log(recipes)
      } catch (error) {
        console.log(error)
      }
    }

    if (props.userId) {
      fetchUserFavorites(props.userId, { ingredients: [], keywords: [] })
    }
  }, [])

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
        {favorites.map((recipe) => (
          <div key={recipe.id}>{recipe.recipeTitle}</div>
        ))}
      </div>
    </>
  )
}
