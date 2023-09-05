import { BsFilterLeft } from "react-icons/bs"

import styles from "./Head.module.css"
import { BackButton } from "@/components/elements/button/BackButton"

interface Props {
  showBackButton: boolean
  onClickPreviousPage?: () => void
  onClickOpenHamburger: () => void
}

export const Head = ({ showBackButton, onClickPreviousPage, onClickOpenHamburger }: Props) => {
  return (
    <div className={styles.root}>
      {showBackButton && onClickPreviousPage && <BackButton onClick={onClickPreviousPage} />}
      <div className={styles.howto} onClick={onClickOpenHamburger}>
        <BsFilterLeft size="1.8rem" />
      </div>
    </div>
  )
}
