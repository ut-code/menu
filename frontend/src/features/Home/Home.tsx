import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { Recipe, getUserFavoritesApi, postUserFavoritesApi, deleteUserFavoritesApi } from "@/utils/recipes"

interface Props {
  session: Session | null
}

export const Home = ({ session }: Props) => {
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

    if (session?.user?.id) {
      fetchUserFavorites(session?.user?.id)
    }
  }, [runEffect])

  const onClickAddFavorite = (recipeId: number) => async () => {
    if (!session?.user?.id) return
    const response = await fetch(postUserFavoritesApi(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session?.user?.id, recipeId: recipeId }),
    })
    const userFavorite = await response.json()
    console.log(userFavorite)
    setRunEffect((prev) => !prev)
  }

  const onClickDeleteFavorite = (recipeId: number) => async () => {
    if (!session?.user?.id) return
    const response = await fetch(deleteUserFavoritesApi(session?.user?.id, recipeId), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session?.user?.id, recipeId: recipeId }),
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
        <Link to={"/search"}>
          <button>検索結果</button>
        </Link>
        <br></br>
        <Link to={"/home/favorites"}>
          <button>お気に入り</button>
        </Link>
        <br></br>
        <input onChange={(e) => setTmp(Number(e.target.value))} type="number" />
        <button onClick={onClickAddFavorite(tmp)} type="submit">
          お気に入りに追加
        </button>
        <br></br>
        <button onClick={() => setRunEffect((prev) => !prev)}>更新</button>
        <ul>
          {favoriteRecipes.map((recipe) => (
            <span key={recipe.id}>
              <li>{recipe.recipeTitle}</li>
              <button onClick={onClickDeleteFavorite(recipe.id)}>お気に入りから削除</button>
            </span>
          ))}
        </ul>
      </div>
    </>
  )
}
