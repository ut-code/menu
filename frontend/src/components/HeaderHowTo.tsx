import { useNavigate } from "react-router-dom"

import { BsQuestion } from "react-icons/bs"
import styles from "@/assets/css/HeaderHowTo.module.css"

export default function HeaderHowTo() {
  const Navigate = useNavigate()

  return (
    <div className={styles.root}>
      <div className={styles.logo} onClick={() => Navigate("/home")}>
        だるめし Dull Meshi
      </div>
      <div className={styles.howto}>
        <BsQuestion size="1.2rem" />
      </div>
    </div>
  )
}
