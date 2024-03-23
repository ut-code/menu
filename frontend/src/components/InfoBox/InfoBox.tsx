import styles from "./InfoBox.module.css"

export const InfoBox = () => {
  return (
    <div className={styles.infobox}>
      <h4>🐶 検索のヒント</h4>
      <h5>
        冷蔵庫に余っているちょっと使い道に困るような食材の名前を入れてみると、自分では思いつかないようなレシピが見つかるかもしれません！
      </h5>
    </div>
  )
}
