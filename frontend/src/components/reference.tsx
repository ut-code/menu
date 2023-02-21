import styles from "@/assets/css/reference.module.css"
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react"

// turn url into a domein name
const changeUrl = (url: string) => {
  const urlArray = url.split("/")
  return urlArray[2]
}

export default function Reference(props: { url: string }) {
  return (
    <div className={styles.tag}>
      <p>{changeUrl(props.url)}</p>
    </div>
  )
}
