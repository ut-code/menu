import { render } from "@testing-library/react"
import { Session } from "@supabase/supabase-js"
import "@testing-library/jest-dom"
import { Auth } from "./Auth"

describe("Auth component", () => {
  it("renders SignIn component when no session is provided", () => {
    render(<Auth session={null} />)
  })

  it("renders SignOut and DeleteAccount components when a session is provided", () => {
    const mockSession = { user: { id: "user_id" } } as Session
    const { getByText } = render(<Auth session={mockSession} />)
    const loggedInText = getByText("Already logged in")
    expect(loggedInText).toBeInTheDocument()
  })
})
