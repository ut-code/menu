import { Link } from "react-router-dom"
import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"

import FadeIn from "@/components/FadeIn"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "@/assets/css/style.css"

export default function Home() {
  // 永続的に残るので、localStorageから問題への回答を消しておく
  useEffect(() => {
    for (let i = 0; i < 4; i++) {
      localStorage.removeItem("answer-" + i.toString())
    }
  }, [])

  const controls = useAnimation()
  useEffect(() => {
    FadeIn({ controls })
  }, [])

  return (
    <>
      <motion.div animate={controls}>
        <Header />

        <Link to={"/questions"}>はじめる ←ボタンになってます</Link>
        <br></br>
        <Link to={"/result"}>検索結果 ←ボタンになってます</Link>
        <br></br>
        <Link to={"/message"}>掲示板 ←ボタンになってます</Link>
        <Footer />
      </motion.div>
    </>
  )
}
