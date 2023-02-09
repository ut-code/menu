import { Routes, Route } from "react-router-dom"

import Home from "@/pages/Home"
import Message from "@/pages/Message"
import Question1 from "@/pages/Question1"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/message" element={<Message />}></Route>
        <Route path="/question-1" element={<Question1 />}></Route>
      </Routes>
    </>
  )
}
