import { Link } from "react-router-dom"
import { BsArrowRight } from "react-icons/bs"
import { Recipe } from "@/utils/recipes"
import styles from "./Card.module.css"

interface Props {
  recipe: Recipe
}

export const Card = ({ recipe }: Props) => {
  const recipeMaterialConverted = recipe.recipeMaterial.join("・")

  return (
    <Link to={recipe.recipeUrl} target="_blank" rel="noopener noreferrer">
      <div className={styles.root}>
        <div className={styles.image_box}>
          {/* <img className={styles.image_frame_blur} src={recipe.foodImageUrls[0]} /> */}
          <img className={styles.image_frame} src={recipe.foodImageUrls[0]} />
        </div>
        <div className={styles.hr}>{"-"}</div>
        <div className={styles.text_container}>
          <div className={styles.left}>
            <span className={styles.text_title}>{recipe.recipeTitle}</span>
            <span className={styles.text_material}>{recipeMaterialConverted}</span>
          </div>
          <div className={styles.arrow}>
            <BsArrowRight size="1rem" color="white" />
          </div>
        </div>
      </div>
    </Link>
  )
}
