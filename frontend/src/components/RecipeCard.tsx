import { Link } from "react-router-dom"

import TipReference from "../components/TipReference"
import styles from "../assets/css/RecipeCard.module.css"

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
        <img className={styles.iframe} src={props.foodImageUrl} />
        <div className={styles.textbox}>
          <div className={styles.text_title}>{props.title}</div>
          <div className={styles.text_material}>{props.material}</div>
          <TipReference url={props.recipeUrl} />
        </div>
      </Link>
    </div>
  )
}
