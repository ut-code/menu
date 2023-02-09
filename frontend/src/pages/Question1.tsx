import { useState, useEffect } from "react"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "@/assets/css/style.css"

export default function Home() {
  return (
    <>
      <Header />
      <ul>
        {/* {recipes.map((recipe) => (
          <li key={recipe.categoryId}>{recipe.categoryName}</li>
        ))} */}
      </ul>
      <a href="/message">掲示板</a>
      <Footer />
    </>
  )
}
