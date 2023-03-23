import { Link } from "react-router-dom"

import TipReference from "@/components/TipReference/TipReference"
import styles from "./RecipeCard.module.css"

interface Props {
  recipeUrl: string
  foodImageUrl: string
  title: string
  material: string
}

export default function RecipeCard(props: Props) {
  return (
    <div className={styles.root}>
      <Link to={props.recipeUrl} target="_blank" rel="noopener noreferrer">
        <div className={styles.imagebox}>
          <img className={styles.iframe_blur} src={props.foodImageUrl} />
          <img className={styles.iframe} src={props.foodImageUrl} />
        </div>

        <div className={styles.textbox}>
          <div className={styles.text_title}>{props.title}</div>
          <div className={styles.text_material}>{props.material}</div>
          <TipReference url={props.recipeUrl} />
        </div>
      </Link>
    </div>
  )
}
