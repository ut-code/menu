import { useState, useEffect, useContext } from "react"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import { getUserFavoritesApi, postUserFavoritesApi, deleteUserFavoritesApi } from "../../utils/apiUtils"
import { UserContext } from "../../utils/context"
import { Loading } from "../../components/Loading"
import { RecipeCard } from "../../components/RecipeCard"
import { Chip } from "../../components/Chip"
import { BorderButton } from "../../components/BorderButton"

import styles from "./Favorite.module.css"
import emptyImage from "../../assets/image/Howto4.png"
// import GridViewIcon from "@mui/icons-material/GridView"

import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import "./swiper.css"
import type { components } from "../../../../types/api"

type Recipe = components["schemas"]["Recipe"]

export const Favorite = () => {
  const queryClient = useQueryClient()
  const { session } = useContext(UserContext)
  const navigate = useNavigate()

  const [initialFavoriteRecipes, setInitialFavoriteRecipes] = useState<Recipe[]>([])
  const [filterStapleFood, setFilterStapleFood] = useState<boolean>(false)
  const [filterMainDish, setFilterMainDish] = useState<boolean>(false)
  const [filterSideDish, setFilterSideDish] = useState<boolean>(false)
  const [filterSoup, setFilterSoup] = useState<boolean>(false)
  const [filterDessert, setFilterDessert] = useState<boolean>(false)
  const [filterQuick, setFilterQuick] = useState<boolean>(false)
  const [filterStandard, setFilterStandard] = useState<boolean>(false)
  const [filterHard, setFilterHard] = useState<boolean>(false)

  const recipes = initialFavoriteRecipes.filter((recipe) => {
    if (!filterStapleFood && !filterMainDish && !filterSideDish && !filterSoup) return true
    // NOTE: OR条件でfilterをかける
    if (filterStapleFood && recipe.dish === "主食") return true
    if (filterMainDish && recipe.dish === "主菜") return true
    if (filterSideDish && recipe.dish === "副菜") return true
    if (filterSoup && recipe.dish === "スープ") return true
    if (filterDessert && recipe.dish === "デザート") return true
    if (filterQuick && 1 <= recipe.totalCookingTime && recipe.totalCookingTime < 20) return true
    if (filterStandard && 20 <= recipe.totalCookingTime && recipe.totalCookingTime < 45) return true
    if (filterHard && 45 <= recipe.totalCookingTime) return true
    return false
  })

  // NOTE: コードの再利用性は悪いが、こうするしかなかった…
  useEffect(() => {
    if (!session?.access_token) return
    const fetchFavoriteRecipes = async () => {
      const response = await fetch(getUserFavoritesApi(), {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) throw new Error("お気に入りの取得に失敗しました")
      const recipes: Recipe[] = await response.json()
      setInitialFavoriteRecipes(recipes)
    }
    fetchFavoriteRecipes()
  }, [])

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
      if (!response.ok) throw new Error("お気に入りの削除に失敗しました")
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteRecipes"])
    },
  })

  const toggleFavorite = (recipeId: number) => {
    if (!favoriteRecipes) return
    if (favoriteRecipes.some((recipe) => recipe.id === recipeId)) {
      onClickDeleteFavorite.mutate(recipeId)
    } else {
      onClickAddFavorite.mutate(recipeId)
    }
  }

  if (isLoading) return <Loading />
  if (!session?.access_token)
    return (
      <div className={styles.noResult}>
        <div className={styles.imageArea}>
          <img src={emptyImage} alt="empty" style={{ width: "300px" }} />
          <h4 className={styles.text}>だるめしにログインして作成機能を使ってみましょう</h4>
        </div>
        <BorderButton onClick={() => navigate("/Auth")} disabled={false}>
          <p>ログインする</p>
        </BorderButton>
      </div>
    )

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <Swiper
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          slidesPerView={"auto"}
          spaceBetween={8}
          freeMode={true}
          modules={[FreeMode]}
          className={"root"}
        >
          <SwiperSlide key="主食">
            <Chip label="主食" onChange={() => setFilterStapleFood((f) => !f)} checked={filterStapleFood} />
          </SwiperSlide>
          <SwiperSlide key="主菜">
            <Chip label="主菜" onChange={() => setFilterMainDish((f) => !f)} checked={filterMainDish} />
          </SwiperSlide>
          <SwiperSlide key="副菜">
            <Chip label="副菜" onChange={() => setFilterSideDish((f) => !f)} checked={filterSideDish} />
          </SwiperSlide>
          <SwiperSlide key="スープ">
            <Chip label="スープ" onChange={() => setFilterSoup((f) => !f)} checked={filterSoup} />
          </SwiperSlide>
          <SwiperSlide key="デザート">
            <Chip label="デザート" onChange={() => setFilterDessert((f) => !f)} checked={filterDessert} />
          </SwiperSlide>
          <SwiperSlide key="時短">
            <Chip label="時短" onChange={() => setFilterQuick((f) => !f)} checked={filterQuick} />
          </SwiperSlide>
          <SwiperSlide key="普通">
            <Chip label="普通" onChange={() => setFilterStandard((f) => !f)} checked={filterStandard} />
          </SwiperSlide>
          <SwiperSlide key="じっくり">
            <Chip label="じっくり" onChange={() => setFilterHard((f) => !f)} checked={filterHard} />
          </SwiperSlide>
        </Swiper>
        {/* <div className={styles.changeButton}>
          <button>
            <GridViewIcon style={{ width: 18, height: 18 }} />
            <h5>表示切り替え</h5>
          </button>
        </div> */}
      </div>
      <div className={styles.cards}>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favoriteRecipes={favoriteRecipes}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          // TODO: サインインしてないときに表示を変える
          <div className={styles.noResult}>
            <img src={emptyImage} alt="empty" style={{ width: "300px" }} />
            <h4 style={{ fontWeight: 400 }}>
              お気に入りのレシピがありません。検索したレシピをお気に入りに追加してみましょう
            </h4>
          </div>
        )}
      </div>
    </div>
  )
}
