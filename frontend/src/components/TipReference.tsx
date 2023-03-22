import styles from "@/assets/css/TipReference.module.css"

interface dict {
  [key: string]: string
}

const urlDomainToName: dict = {
  "www.kurashiru.com": "クラシル",
  "www.kyounoryouri.jp": "みんなのきょうの料理",
  "www.lettuceclub.net": "レタスクラブ",
  "www.tablemark.co.jp": "テーブルマーク",
  "www.ebarafoods.com": "エバラ食品",
  "park.ajinomoto.co.jp": "味の素パーク",
  "www.ntv.co.jp/3min/": "キユーピー",
  "www.meg-snow.com": "雪印メグミルク",
  "www.salad-cafe.com": "サラダカフェ",
  "dancyu.jp": "dancyu",
  "www.yutori.co.jp": "ゆとりの空間",
  "recipe.rakuten.co.jp": "楽天レシピ",
}

const translateUrlToSiteName = (url: string): string => {
  const urlArray: string[] = url.split("/")
  if (urlArray.length < 3) return url // 例外処理

  const urlDomain: string = urlArray[2]
  return urlDomainToName[urlDomain]
}

export default function Reference(props: { url: string }) {
  return <div className={styles.tip}>{translateUrlToSiteName(props.url)}</div>
}
