import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Message from "./pages/Message"
import Questions from "./pages/Questions"
import Result from "./pages/Result"

import "./assets/css/global.css"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/message" element={<Message />}></Route>
        <Route path="/questions" element={<Questions />}></Route>
        <Route path="/result" element={<Result />}></Route>
      </Routes>
    </>
  )
}
