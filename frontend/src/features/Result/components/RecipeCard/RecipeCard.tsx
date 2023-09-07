import { Link } from "react-router-dom"
import { Session } from "@supabase/supabase-js"

import { AiFillHeart } from "react-icons/ai"
import { TipReference } from "@/components/TipReference"
import { Recipe } from "@/utils/recipes"
import styles from "./RecipeCard.module.css"

interface Props {
  recipe: Recipe
  session: Session | null
}

export const RecipeCard = ({ recipe, session }: Props) => {
  const recipeMaterialConverted = recipe.recipeMaterial.join("・")

  return (
    <Link to={recipe.recipeUrl} target="_blank" rel="noopener noreferrer">
      <div className={styles.root}>
        <img className={styles.image_frame} src={recipe.foodImageUrls[0]} />
        {session && (
          <div className={styles.icon}>
            <AiFillHeart color="red" />
          </div>
        )}
        <div className={styles.hr}>{"_"}</div>
        <div className={styles.text_container}>
          <div className={styles.left}>
            <span className={styles.text_title}>{recipe.recipeTitle}</span>
            <span className={styles.text_material}>{recipeMaterialConverted}</span>
            <TipReference url={recipe.recipeUrl} />
          </div>
        </div>
      </div>
    </Link>
  )
}
