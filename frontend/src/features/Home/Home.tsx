import { Link } from "react-router-dom"
import { useState } from "react"
import { Session } from "@supabase/supabase-js"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

import { Recipe } from "@/utils/recipes"
import { getUserFavoritesApi, postUserFavoritesApi, deleteUserFavoritesApi } from "@/utils/apiUtils"
import { DeleteAccount } from "@/features/Auth/DeleteAccount"
import { SignOut } from "@/features/Auth/SignOut"
import { Head } from "@/components/Head"
import { Hamburger } from "@/components/Hamburger"
import { HorizontalScroll } from "./components/HorizontalScroll"

interface Props {
  session: Session | null
}

export const Home = ({ session }: Props) => {
  const [tmp, setTmp] = useState<number>(0)
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)
  const queryClient = useQueryClient()

  // 永続的に残るので、localStorageから問題への回答を消しておく
  localStorage.removeItem("ingredients")
  localStorage.removeItem("genre")
  localStorage.removeItem("cookingTime")

  // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
  const { data: favoriteRecipes, isLoading } = useQuery({
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

  // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
  const onClickAddFavorite = useMutation({
    mutationFn: async (recipeId: number) => {
      if (!session?.access_token) return []
      const response = await fetch(postUserFavoritesApi(), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ recipeId: recipeId }),
      })
      if (!response.ok) throw new Error("お気に入りの追加に失敗しました")
      const userFavorite = await response.json()
      console.log(userFavorite)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteRecipes"])
    },
  })

  // NOTE: https://www.notion.so/utcode/JWT-4743f0e6a64e4ee7848818c9bc0efee1?pvs=4
  const onClickDeleteFavorite = useMutation({
    mutationFn: async (recipeId: number) => {
      if (!session?.access_token) return []
      const response = await fetch(deleteUserFavoritesApi(recipeId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) throw new Error("お気に入りの取得に失敗しました")
      const userFavorite = await response.json()
      console.log(userFavorite)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteRecipes"])
    },
  })

  const onClickOpenHamburger = () => setIsOpenHamburger(true)
  const onClickCloseHamburger = () => setIsOpenHamburger(false)

  if (isLoading) return <p>お気に入りを読み込み中</p>
  return (
    <>
      <div className="style_lightbrown">
        <Head showBackButton={false} onClickOpenHamburger={onClickOpenHamburger} />
        {isOpenHamburger === true && <Hamburger onClickCloseHamburger={onClickCloseHamburger} />}
        Futabaさん
        <Link to={"/questions"}>
          <button>はじめる</button>
        </Link>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>人気のレシピ</h3>
            <Link to={"/home/favorites"}>
              <button>もっと見る</button>
            </Link>
          </div>
          <HorizontalScroll recipes={[]} />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>季節のレシピ</h3>
            <Link to={"/home/favorites"}>
              <button>もっと見る</button>
            </Link>
          </div>
          <HorizontalScroll
            recipes={[
              {
                foodImageUrls: ["https://www.lettuceclub.net/i/R1/img/dish/1/S20121025043001A_000.png"],
                id: 9,
                keywords: ["佐藤ひろみ", "塩分控えめ", "行楽"],
                recipeDescription: "甘辛だれのだんごを卵黄につけて",
                recipeMaterial: [
                  "たね",
                  "　大豆の水煮…120g",
                  "　もめん豆腐…1/2丁(約150g)",
                  "　しょうがのみじん切り…１かけ分",
                  "　片栗粉…大さじ１",
                  "　塩、こしょう…各少々",
                  "卵黄…１個分",
                  "たれ",
                  "　しょうゆ…大さじ１",
                  "　砂糖、みりん、酒…各大さじ1/2",
                  "　片栗粉…小さじ1/2",
                  "　水…大さじ１",
                  "サラダ油",
                ],
                recipeTitle: "大豆と豆腐のふわふわだんご",
                recipeUrl: "https://www.lettuceclub.net/recipe/dish/19945/",
                totalTime: -1,
              },
            ]}
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>お気に入り</h3>
            <Link to={"/home/favorites"}>
              <button>もっと見る</button>
            </Link>
          </div>
          <HorizontalScroll recipes={favoriteRecipes?.slice(0, 6)} />
        </div>
      </div>

      <hr />

      <div className="style_lightbrown">
        <Link to={"/search"}>
          <button>検索結果</button>
        </Link>
        <br></br>

        {session && (
          <div>
            <p>Already logged in</p>
            <SignOut />
            <br />
            <DeleteAccount session={session} />
          </div>
        )}
        <br></br>
        <Link to={"/auth"}>
          <button>サインアップ</button>
        </Link>
        <br></br>
        <br></br>
        <input onChange={(e) => setTmp(Number(e.target.value))} type="number" />
        <button onClick={() => onClickAddFavorite.mutate(tmp)} type="submit">
          お気に入りに追加
        </button>
        {favoriteRecipes ? (
          <ul>
            {favoriteRecipes.map((recipe) => (
              <span key={recipe.id}>
                <li>{recipe.recipeTitle}</li>
                <button onClick={() => onClickDeleteFavorite.mutate(recipe.id)}>お気に入りから削除</button>
              </span>
            ))}
          </ul>
        ) : (
          <p>お気に入りはまだありません。ハートボタンを押して追加してみましょう。</p>
        )}
      </div>
    </>
  )
}
