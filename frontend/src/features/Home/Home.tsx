import { Link } from "react-router-dom"
import { useEffect } from "react"

export const Home = () => {
  // 永続的に残るので、localStorageから問題への回答を消しておく
  useEffect(() => {
    localStorage.removeItem("ingredients")
    localStorage.removeItem("genre")
    localStorage.removeItem("cookingTime")
  }, [])

  return (
    <>
      <div className="style_lightbrown">
        <Link to={"/questions"}>
          <button>はじめる</button>
        </Link>
        <br></br>
        <Link to={"/result"}>
          <button>検索結果</button>
        </Link>
      </div>
    </>
  )
}
