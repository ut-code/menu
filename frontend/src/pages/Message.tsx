import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"

import FadeIn from "@/components/FadeIn"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "@/assets/css/style.css"

/*
 * Vite はトランスパイル時に import.meta.env のプロパティを VITE_ から始まる環境変数に置換する
 * これを利用して本番環境と開発環境で Fetch API のリクエスト先を切り替えられる
 * 参考: https://ja.vitejs.dev/guide/env-and-mode.html
 */
const getMessagesApi = `${import.meta.env.VITE_API_ENDPOINT}/messages`
const postSendApi = `${import.meta.env.VITE_API_ENDPOINT}/send`

type Message = { id: number; content: string }

export default function Message() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessageContent, setNewMessageContent] = useState("")

  //----------------------------------------------------------------
  // コンポーネント読み込み時に処理を実行するには useEffect フックを使う
  // 5000ms ごとにメッセージを取得
  //----------------------------------------------------------------
  useEffect(() => {
    const timerId = setInterval(async () => {
      const response = await fetch(getMessagesApi)
      setMessages(await response.json())
    }, 1000 * 5)

    // useEffect フックに指定した関数の戻り値に指定した関数はコンポーネントの破棄時に実行される
    return () => {
      clearInterval(timerId)
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
        <Link to={"/home"}>戻る</Link>

        <ul>
          {messages.map((message) => (
            <li key={message.id}>{message.content}</li>
          ))}
        </ul>
        <input
          value={newMessageContent}
          onChange={(e) => {
            setNewMessageContent(e.target.value)
          }}
        />
        <button
          type="button"
          onClick={async () => {
            await fetch(postSendApi, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content: newMessageContent }),
            })
          }}
        >
          送信
        </button>

        <Footer />
      </motion.div>
    </>
  )
}
