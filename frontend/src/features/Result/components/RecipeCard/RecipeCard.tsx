import { Link } from "react-router-dom"

import { AiFillHeart } from "react-icons/ai"
import { TipReference } from "@/components/TipReference"
import { Recipe } from "@/utils/recipes"
import styles from "./RecipeCard.module.css"

interface Props {
  recipe: Recipe
}

export const RecipeCard = ({ recipe }: Props) => {
  const recipeMaterialConverted = recipe.recipeMaterial.join("・")

  return (
    // <div className={styles.root}>
    //   <Link to={recipe.recipeUrl} target="_blank" rel="noopener noreferrer">
    //     <div className={styles.imagebox}>
    //       <img className={styles.iframe_blur} src={recipe.foodImageUrls[0]} />
    //       <img className={styles.iframe} src={recipe.foodImageUrls[0]} />
    //     </div>

    //     <div className={styles.textbox}>
    //       <div className={styles.text_title}>{recipe.recipeTitle}</div>
    //       <div className={styles.text_material}>{recipeMaterialConverted}</div>
    //       <TipReference url={recipe.recipeUrl} />
    //     </div>
    //   </Link>
    // </div>

    <Link to={recipe.recipeUrl} target="_blank" rel="noopener noreferrer">
      <div className={styles.root}>
        <img className={styles.image_frame} src={recipe.foodImageUrls[0]} />
        <div className={styles.hr}>{"_"}</div>
        <div className={styles.icon}>
          <AiFillHeart color="red" />
        </div>
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
