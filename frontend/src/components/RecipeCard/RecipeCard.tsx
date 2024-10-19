import { useContext, useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

import FavoriteIcon from "@mui/icons-material/Favorite"
import { Box } from "@mui/material"
import { TipReference } from "../TipReference"
import { UserContext } from "../../utils/context"
import styles from "./RecipeCard.module.css"
import type { components } from "../../../../types/api"

type Recipe = components["schemas"]["Recipe"]

interface Props {
  recipe: Recipe
  isFavorited: boolean
  toggleFavorite: (recipeId: number) => void
}

export const RecipeCard = ({ recipe, isFavorited, toggleFavorite }: Props) => {
  const { session } = useContext(UserContext)
  const textRef = useRef<HTMLDivElement>(null)
  const [textHeight, setTextHeight] = useState<number>(0)

  useEffect(() => {
    if (textRef.current) {
      setTextHeight(textRef.current.clientHeight)
    }
  }, [textRef.current])

  const materialsConverted = recipe.materials.join("・")
  const onClickHandler = (recipeId: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (!session?.access_token) return
    // NOTE: LinkとonClickは別メソッド？なので event.stopPropagation() だとうまく行かなかった
    event.preventDefault()
    toggleFavorite(recipeId)
  }

  return (
    <Link to={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
      <div className={styles.container}>
        <img
          src={recipe.foodImageUrl}
          loading="lazy"
          style={{
            width: "88px",
            height: textHeight,
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "12px 0px 0px 12px",
          }}
          alt={recipe.title}
        />
        <Box
          ref={textRef}
          flexDirection={"column"}
          display={"flex"}
          alignItems={"flex-start"}
          p={"16px"}
          position={"relative"}
          width={"100%"}
        >
          {session?.access_token && (
            <div
              className={styles.icon}
              onClick={(event: React.MouseEvent<HTMLDivElement>) => onClickHandler(recipe.id, event)}
            >
              <FavoriteIcon style={{ color: isFavorited ? "#FF165D" : "#D9D9D9" }} />
            </div>
          )}
          <div className={styles.text_area}>
            <div className={styles.title_area}>
              <h3 className={styles.txt_limit}>{recipe.title}</h3>
              <TipReference url={recipe.sourceUrl} />
            </div>
            <h5 className={styles.txt_limit}>{materialsConverted}</h5>
          </div>
        </Box>
      </div>
    </Link>
  )
}
