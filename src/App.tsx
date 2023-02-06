import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "@/pages/Home"
import Todo from "@/pages/Todo"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </>
  )
}
