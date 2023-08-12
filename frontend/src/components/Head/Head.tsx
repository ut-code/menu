import { useNavigate } from "react-router-dom"

import { BsFilterLeft } from "react-icons/bs"
import styles from "./Head.module.css"

import { BackButton } from "@/components/elements/button/BackButton"

interface Props {
  showBackButton: boolean
  onClickPreviousPage: () => void
  onClickOpenHamburger: () => void
}

export const Head = (props: Props) => {
  const Navigate = useNavigate()

  return (
    <div className={styles.root}>
      {!props.showBackButton && (
        <div className={styles.logo} onClick={() => Navigate("/home")}>
          だるめし Dull Meshi
        </div>
      )}
      {props.showBackButton && <BackButton onClick={props.onClickPreviousPage} />}
      <div className={styles.howto} onClick={props.onClickOpenHamburger}>
        <BsFilterLeft size="1.8rem" />
      </div>
    </div>
  )
}
