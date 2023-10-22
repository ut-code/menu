import { Link } from "react-router-dom"
import { BsArrowRight } from "react-icons/bs"
import { Recipe } from "@/utils/recipes"
import styles from "./Card.module.css"

interface Props {
  recipe: Recipe
}

export const Card = ({ recipe }: Props) => {
  const materialsConverted = recipe.materials.join("・")

  return (
    <Link to={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
      <div className={styles.root}>
        <img className={styles.image_frame} src={recipe.foodImageUrl} />
        <div className={styles.hr}>{"_"}</div>
        <div className={styles.text_container}>
          <div className={styles.left}>
            <span className={styles.text_title}>{recipe.title}</span>
            <span className={styles.text_material}>{materialsConverted}</span>
          </div>
          <div className={styles.icon}>
            <BsArrowRight color="white" />
          </div>
        </div>
      </div>
    </Link>
  )
}
