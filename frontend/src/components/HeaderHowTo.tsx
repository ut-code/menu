import { useNavigate } from "react-router-dom"
import { BsQuestion } from "react-icons/bs"
import styles from "@/assets/css/headerHowTo.module.css"

export default function HeaderHowTo() {
  const navigate = useNavigate()

  return (
    <div className={styles.title}>
      <div className={styles.titleApp} onClick={() => navigate("/home")}>
        だるめし Dull Meshi
      </div>
      <div className={styles.titleHowTo}>
        <BsQuestion size="1.2rem" />
      </div>
    </div>
  )
}
