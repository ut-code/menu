import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Home } from "./Home"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

it("renders home page correctly", () => {
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Home session={null} />
      </QueryClientProvider>
    </MemoryRouter>
  )
})
