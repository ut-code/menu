import { Routes, Route } from "react-router-dom"

import { Home } from "@/features/Home"
import { HowTo } from "@/features/HowTo"
import { Questions } from "@/features/Questions"
import { Result } from "@/features/Result"

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
