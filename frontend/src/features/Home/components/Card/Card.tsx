import { Link } from "react-router-dom"
import { BsArrowRight } from "react-icons/bs"
import { Recipe } from "@/utils/recipes"
import styles from "./Card.module.css"

interface Props {
  recipe: Recipe
}

export const Card = ({ recipe }: Props) => {
  const maxTitleLength = 11
  const recipeTitleConverted = recipe.recipeTitle.substring(0, maxTitleLength)
  const maxMaterialLength = 26
  const recipeMaterialConverted = recipe.recipeMaterial.join("・").substring(0, maxMaterialLength)

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
            <span className={styles.text_title}>{recipeTitleConverted}</span>
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
