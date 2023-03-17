import { Link } from "react-router-dom"
import { useEffect } from "react"

import Footer from "@/components/Footer"
import Recommendation from "@/components/Recommendation"

import imgTomato from "@/assets/image/tomato.webp"
import imgBroccoli from "@/assets/image/broccoli.webp"

export default function Home() {
  // 永続的に残るので、localStorageから問題への回答を消しておく
  useEffect(() => {
    for (let i = 0; i < 4; i++) {
      localStorage.removeItem("answer-" + i.toString())
    }
  }, [])

  return (
    <>
      <div className="style1">
        <div style={{ display: "flex" }}>
          <Link to={"/questions"}>
            <button>はじめる</button>
          </Link>
          <br></br>
          <Link to={"/result"}>
            <button>検索結果</button>
          </Link>
          <br></br>
          <Link to={"/message"}>
            <button>掲示板</button>
          </Link>
        </div>
        <br></br>
        <div style={{ display: "flex" }}>
          <Recommendation ingredientName="トマト" ingredientImage={imgTomato} />
          <Recommendation ingredientName="ブロッコリー" ingredientImage={imgBroccoli} />
        </div>
        <br></br>
        <Footer />
      </div>
    </>
  )
}
