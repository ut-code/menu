import { Routes, Route } from "react-router-dom"

import Home from "@/pages/Home"
import HowTo from "@/pages/HowTo"
import Questions from "@/pages/Questions"
import Result from "@/pages/Result"

import "@/components/css/global.css"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HowTo />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/questions" element={<Questions />}></Route>
        <Route path="/result" element={<Result />}></Route>
      </Routes>
    </>
  )
}
