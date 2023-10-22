import { Link } from "react-router-dom"
import { Session } from "@supabase/supabase-js"

import { AiFillHeart } from "react-icons/ai"
import { TipReference } from "@/components/TipReference"
import { Recipe } from "@/utils/recipes"
import styles from "./RecipeCard.module.css"

interface Props {
  recipe: Recipe
  favoriteRecipes: Recipe[] | undefined
  toggleFavorite: (recipeId: number) => void
  session: Session | null
}

export const RecipeCard = ({ recipe, favoriteRecipes, toggleFavorite, session }: Props) => {
  const materialsConverted = recipe.materials.join("・")

  const isFavorite: boolean =
    favoriteRecipes !== undefined && favoriteRecipes.some((favoriteRecipe) => favoriteRecipe.id === recipe.id)

  const onClickHandler = (recipeId: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (!session) return
    // NOTE: LinkとonClickは別メソッド？なので event.stopPropagation() だとうまく行かなかった
    event.preventDefault()
    toggleFavorite(recipeId)
  }

  return (
    <Link to={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
      <div className={styles.root}>
        <img className={styles.image_frame} src={recipe.foodImageUrl} />
        {session && (
          <div
            className={styles.icon}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => onClickHandler(recipe.id, event)}
          >
            <AiFillHeart color={isFavorite ? "red" : "gray"} />
          </div>
        )}
        <div className={styles.hr}>{"_"}</div>
        <div className={styles.text_container}>
          <div className={styles.left}>
            <span className={styles.text_title}>{recipe.title}</span>
            <span className={styles.text_material}>{materialsConverted}</span>
            <TipReference url={recipe.sourceUrl} />
          </div>
        </div>
      </div>
    </Link>
  )
}
