import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Home from "./Home"

it("renders home page correctly", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
})
