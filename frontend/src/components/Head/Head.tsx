import { BsFilterLeft } from "react-icons/bs"

import styles from "./Head.module.css"
import { BackButton } from "@/components/elements/button/BackButton"

interface Props {
  showBackButton: boolean
  onClickPreviousPage?: () => void
  onClickOpenHamburger: () => void
  filterWhite?: boolean
}

export const Head = ({ showBackButton, onClickPreviousPage, onClickOpenHamburger, filterWhite }: Props) => {
  return (
    <div className={styles.root}>
      {showBackButton && onClickPreviousPage && <BackButton onClick={onClickPreviousPage} />}
      <div className={styles.howto} onClick={onClickOpenHamburger}>
        <BsFilterLeft color={filterWhite ? "white" : "black"} size="1.8rem" />
      </div>
    </div>
  )
}
