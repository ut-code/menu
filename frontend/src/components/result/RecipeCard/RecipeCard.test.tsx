import "@testing-library/jest-dom"

import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import { RecipeCard } from "./RecipeCard"

describe("RecipeCard", () => {
  const mockProps = {
    recipeUrl: "/recipe/1",
    foodImageUrl: "http://example.com/image.jpg",
    title: "Test Recipe",
    material: "Test Material",
  }

  it("renders the recipe card correctly", () => {
    render(
      <Router>
        <RecipeCard {...mockProps} />
      </Router>
    )

    const images = screen.getAllByRole("img")
    const targetImage = images.find((img) => img.getAttribute("src") === mockProps.foodImageUrl)
    // targetImageが存在することを確認
    expect(targetImage).toBeDefined()
    // さらに、それが正しい属性を持っていることを確認
    expect(targetImage).toHaveAttribute("src", mockProps.foodImageUrl)

    expect(screen.getByText(mockProps.title)).toBeInTheDocument()
    expect(screen.getByText(mockProps.material)).toBeInTheDocument()

    const links = screen.getAllByRole("link")
    const targetLink = links.find((link) => link.getAttribute("href") === mockProps.recipeUrl)
    // targetLinkが存在することを確認
    expect(targetLink).toBeDefined()
    // さらに、それが正しい属性を持っていることを確認
    expect(targetLink).toHaveAttribute("href", mockProps.recipeUrl)
  })
})
