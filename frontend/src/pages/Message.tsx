import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import Footer from "../components/Footer/Footer"
import BackButton from "../components/BackButton/BackButton"

/*
 * Vite はトランスパイル時に import.meta.env のプロパティを VITE_ から始まる環境変数に置換する
 * これを利用して本番環境と開発環境で Fetch API のリクエスト先を切り替えられる
 * 参考: https://ja.vitejs.dev/guide/env-and-mode.html
 */
const getMessagesApi = `${import.meta.env.VITE_API_ENDPOINT}/messages`
const postSendApi = `${import.meta.env.VITE_API_ENDPOINT}/send`

type Message = { id: number; content: string; created_at: string }

export default function Message() {
  // useNavigate を Navigate に変化させる呪文
  const Navigate = useNavigate()

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
    // クリーンアップ関数で残留を防ぐ
    return () => {
      clearInterval(timerId)
    }
  }, [])

  return (
    <>
      <div className="style_lightbrown">
        <BackButton onClick={() => Navigate("/home")} />

        <div>
          <p>画面は5秒おきに更新されます</p>
        </div>

        <div style={{ margin: "0 auto 0 0" }}>
          <ul>
            {messages.map((message: Message) => (
              <li key={message.id}>
                {message.content} - {message.created_at.slice(0, 10)}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="messageForm"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}
        >
          <input
            value={newMessageContent}
            onChange={(e) => {
              setNewMessageContent(e.target.value)
            }}
            className="inputIngredient"
          />
          <button
            type="button"
            onClick={async () => {
              await fetch(postSendApi, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessageContent }),
              })
              setNewMessageContent("")
            }}
            style={{ width: "100px" }}
          >
            送信
          </button>
        </div>

        <Footer />
      </div>
    </>
  )
}
