import { useContext } from "react"
import { Link } from "react-router-dom"

import FavoriteIcon from "@mui/icons-material/Favorite"
import { TipReference } from "@/components/TipReference"
import { Recipe } from "@/utils/recipes"
import { UserContext } from "@/utils/context"
import styles from "./RecipeCard.module.css"

interface Props {
  recipe: Recipe
  favoriteRecipes: Recipe[] | undefined
  toggleFavorite: (recipeId: number) => void
}

export const RecipeCard = ({ recipe, favoriteRecipes, toggleFavorite }: Props) => {
  const { session } = useContext(UserContext)

  const materialsConverted = recipe.materials.join("・")

  const isFavorited: boolean =
    favoriteRecipes !== undefined && favoriteRecipes.some((favoriteRecipe) => favoriteRecipe.id === recipe.id)

  const onClickHandler = (recipeId: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (!session) return
    // NOTE: LinkとonClickは別メソッド？なので event.stopPropagation() だとうまく行かなかった
    event.preventDefault()
    toggleFavorite(recipeId)
  }

  return (
    <Link to={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
      <div className={styles.container}>
        <img className={styles.image_frame} src={recipe.foodImageUrl} />
        <div className={styles.text}>
          {session && (
            <div
              className={styles.icon}
              onClick={(event: React.MouseEvent<HTMLDivElement>) => onClickHandler(recipe.id, event)}
            >
              <FavoriteIcon style={{ color: isFavorited ? "red" : "gray" }} />
            </div>
          )}
          <div className={styles.text_area}>
            <div className={styles.title_area}>
              <h3>{recipe.title}</h3>
              <TipReference url={recipe.sourceUrl} />
            </div>
            <h5 className={styles.txt_limit}>{materialsConverted}</h5>
          </div>
        </div>
      </div>
    </Link>
  )
}
