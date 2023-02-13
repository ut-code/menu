import { Routes, Route } from "react-router-dom"

import Home from "@/pages/Home"
import Message from "@/pages/Message"
import Questions from "@/pages/Questions"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/message" element={<Message />}></Route>
        <Route path="/questions" element={<Questions />}></Route>
      </Routes>
    </>
  )
}
