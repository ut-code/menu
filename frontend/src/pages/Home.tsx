import { Link } from "react-router-dom"
import { useEffect } from "react"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Suggestion from "@/components/suggestion"
import "@/assets/css/style.css"

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
        <Header />

        <Link to={"/questions"}>はじめる ←ボタンになってます</Link>
        <br></br>
        <Link to={"/result"}>検索結果 ←ボタンになってます</Link>
        <br></br>
        <Link to={"/message"}>掲示板 ←ボタンになってます</Link>
        <Suggestion ingridientName="トマト" ingridientImage={imgTomato} />
        <Suggestion ingridientName="ブロッコリー" ingridientImage={imgBroccoli} />
        <Footer />
      </div>
    </>
  )
}
