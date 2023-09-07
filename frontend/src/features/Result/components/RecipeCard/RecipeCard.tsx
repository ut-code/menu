import { Link } from "react-router-dom"

import { TipReference } from "@/components/TipReference"
import { Recipe } from "@/utils/recipes"
import styles from "./RecipeCard.module.css"

interface Props {
  recipe: Recipe
}

export const RecipeCard = ({ recipe }: Props) => {
  return (
    <div className={styles.root}>
      <Link to={recipe.recipeUrl} target="_blank" rel="noopener noreferrer">
        <div className={styles.imagebox}>
          <img className={styles.iframe_blur} src={recipe.foodImageUrls[0]} />
          <img className={styles.iframe} src={recipe.foodImageUrls[0]} />
        </div>

        <div className={styles.textbox}>
          <div className={styles.text_title}>{recipe.recipeTitle}</div>
          <div className={styles.text_material}>{recipe.recipeMaterial}</div>
          <TipReference url={recipe.recipeUrl} />
        </div>
      </Link>
    </div>
  )
}
