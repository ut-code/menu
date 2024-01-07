import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { Recipe } from "@/utils/recipes"
import { getUserFavoritesApi, postSearchRecipesKeywordsApi } from "@/utils/apiUtils"
import { UserContext } from "@/utils/context"
import { Head } from "@/components/Head"
import { Hamburger } from "@/components/Hamburger"
import { HorizontalScroll } from "./components/HorizontalScroll"
import { MoreButton } from "@/components/elements/button/MoreButton"
import { Loading } from "@/components/Loading"
import { HomeSearchbox } from "./components/HomeSearchbox"

export const Home = () => {
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  const navigate = useNavigate()
  const { user, session } = useContext(UserContext)

  // 永続的に残るので、localStorageから問題への回答を消しておく
  localStorage.removeItem("questionNumber")
  localStorage.removeItem("ingredients")
  localStorage.removeItem("genre")
  localStorage.removeItem("cookingTime")

  const { data: seasonalRecipes, isLoading: isLoadingSeasonalRecipes } = useQuery({
    queryKey: ["seasonalRecipes"],
    queryFn: async () => {
      const response = await fetch(postSearchRecipesKeywordsApi(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: "夏" }),
      })
      if (!response.ok) throw new Error("レシピの取得に失敗しました")
      const recipes: Recipe[] = await response.json()
      return recipes
    },
  })

  // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
  const { data: favoriteRecipes, isLoading: isLoadingFavoriteRecipes } = useQuery({
    queryKey: ["favoriteRecipes"],
    queryFn: async () => {
      if (!session?.access_token) return []
      const response = await fetch(getUserFavoritesApi(), {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) throw new Error("お気に入りの取得に失敗しました")
      const recipes: Recipe[] = await response.json()
      return recipes
    },
  })

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isOpenHamburger) return <Hamburger onClickCloseHamburger={onClickCloseHamburger} />
  if (isLoadingFavoriteRecipes || isLoadingSeasonalRecipes) return <Loading />
  return (
    <>
      <div className="style_lightbrown">
        <Head showBackButton={false} onClickOpenHamburger={onClickOpenHamburger} />
        <div
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "flex-start",
            marginRight: "auto",
            marginBottom: "15px",
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: "bold", marginLeft: "8px" }}>
            {session ? user?.username : "ゲスト"}
          </span>
          <span style={{ fontSize: "12px", margin: "0 0 6px 10px" }}>さん</span>
        </div>
        <div style={{ width: "100%", marginBottom: "25px" }}>
          <Link to={"/questions"}>
            <HomeSearchbox />
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* TODO: 人気度を測定して人気のレシピを載せる */}
          {/* <div style={{ display: "flex", justifyContent: "space-between", padding: "0 40px 0 48px" }}>
            <h2 style={{ marginBottom: "16px" }}>人気のレシピ</h2>
            <MoreButton onClick={() => navigate("/home/favorites")} />
          </div>
          <HorizontalScroll recipes={favoriteRecipes?.slice(0, 6)} /> */}

          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 40px 0 48px" }}>
            <h2 style={{ marginBottom: "16px" }}>季節のレシピ</h2>
            <MoreButton onClick={() => navigate("/home/seasonal")} />
          </div>
          <HorizontalScroll recipes={seasonalRecipes?.slice(0, 6)} />

          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 40px 0 48px" }}>
            <h2 style={{ marginBottom: "16px" }}>お気に入り</h2>
            <MoreButton onClick={() => navigate("/home/favorites")} />
          </div>
          <HorizontalScroll recipes={favoriteRecipes?.slice(0, 6)} />
        </div>
      </div>
    </>
  )
}
