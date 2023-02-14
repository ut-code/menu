import { Routes, Route } from "react-router-dom"

import Icon from "@/pages/Icon"
import Home from "@/pages/Home"
import Message from "@/pages/Message"
import Questions from "@/pages/Questions"
import Result from "@/pages/Result"
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Icon />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/message" element={<Message />}></Route>
        <Route path="/questions" element={<Questions />}></Route>
        <Route path="/result" element={<Result />}></Route>
      </Routes>
    </>
  )
}
