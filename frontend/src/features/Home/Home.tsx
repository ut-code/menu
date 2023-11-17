import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Session } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"

import { Recipe } from "@/utils/recipes"
import { getUserFavoritesApi, postSearchRecipesKeywordsApi, getUsernameApi, updateUsernameApi } from "@/utils/apiUtils"
import { SignOut } from "@/features/Auth/SignOut"
import { Head } from "@/components/Head"
import { Hamburger } from "@/components/Hamburger"
import { HorizontalScroll } from "./components/HorizontalScroll"
import { MoreButton } from "@/components/elements/button/MoreButton"
import { Loading } from "@/components/Loading"
import { HomeSearchbox } from "./components/HomeSearchbox"

interface Props {
  session: Session | null
}

export const Home = ({ session }: Props) => {
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  const Navigate = useNavigate()

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
        body: JSON.stringify({ keywords: ["夏"] }),
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

  const { data: username } = useQuery({
    queryKey: ["username"],
    queryFn: async () => {
      if (!session?.access_token) return ""
      const response = await fetch(getUsernameApi(), {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) throw new Error("ユーザーネームの取得に失敗しました")
      return await response.json()
    },
  })

  const updateUsername = async (session: Session | null) => {
    console.log(session)
    if (!session?.access_token) return
    const response = await fetch(updateUsernameApi(), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ username: "変更後" }),
    })
    console.log(response)
    if (!response.ok) throw new Error("ユーザーネームの更新に失敗しました")
    const user = await response.json()
    console.log(user)
  }

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isOpenHamburger) return <Hamburger session={session} onClickCloseHamburger={onClickCloseHamburger} />
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
            {session ? username : "ゲスト"}
          </span>
          <span style={{ fontSize: "12px", margin: "0 0 6px 10px" }}>さん</span>
        </div>
        <div style={{ width: "100%", marginBottom: "25px" }}>
          <Link to={"/questions"}>
            <HomeSearchbox />
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 40px 0 48px" }}>
            <h2 style={{ marginBottom: "16px" }}>人気のレシピ</h2>
            <MoreButton onClick={() => Navigate("/home/favorites")} />
          </div>
          <HorizontalScroll recipes={favoriteRecipes?.slice(0, 6)} />

          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 40px 0 48px" }}>
            <h2 style={{ marginBottom: "16px" }}>季節のレシピ</h2>
            <MoreButton onClick={() => Navigate("/home/seasonal")} />
          </div>
          <HorizontalScroll recipes={seasonalRecipes?.slice(0, 6)} />

          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 40px 0 48px" }}>
            <h2 style={{ marginBottom: "16px" }}>お気に入り</h2>
            <MoreButton onClick={() => Navigate("/home/favorites")} />
          </div>
          <HorizontalScroll recipes={favoriteRecipes?.slice(0, 6)} />
        </div>
      </div>

      <hr />

      <div className="style_lightbrown">
        <Link to={"https://gist.github.com/bvv-1/d3c318f90d0720e81259e58de49adc30"}>
          <button>プライバシーポリシー</button>
        </Link>
        <Link to={"/search"}>
          <button>検索結果</button>
        </Link>
        <br></br>

        {session && (
          <div>
            <p>Already logged in</p>
            <SignOut />
          </div>
        )}
        <br></br>
        <Link to={"/auth"}>
          <button>サインアップ</button>
        </Link>
      </div>
      <button onClick={() => updateUsername(session)}>ユーザーネーム更新</button>
    </>
  )
}
