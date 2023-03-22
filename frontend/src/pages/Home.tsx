import { Link } from "react-router-dom"
import { useEffect } from "react"

import Footer from "@/components/Footer/Footer"

export default function Home() {
  // 永続的に残るので、localStorageから問題への回答を消しておく
  useEffect(() => {
    for (let i = 0; i < 4; i++) {
      localStorage.removeItem("answer-" + i.toString())
    }
  }, [])

  return (
    <>
      <div className="style_lightbrown">
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
        <Footer />
      </div>
    </>
  )
}
