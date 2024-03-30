import styles from "./InfoBox.module.css"

export const InfoBox = () => {
  return (
    <div className={styles.infobox}>
      <h4 style={{ fontSize: 16, fontWeight: 700 }}>🐶 検索のヒント</h4>
      <h4>
        冷蔵庫に余っているちょっと使い道に困るような食材の名前を入れてみると、自分では思いつかないようなレシピが見つかるかもしれません！
      </h4>
    </div>
  )
}
