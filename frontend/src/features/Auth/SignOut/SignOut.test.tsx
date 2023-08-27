import { render, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { SignOut } from "./SignOut"
import { supabase } from "../supabaseClient"

beforeAll(() => {
  vi.mock("../supabaseClient")
  window.alert = vi.fn()
})

describe("SignOut component", () => {
  it("should handle sign out and show error alert", async () => {
    const { getByText } = render(<SignOut />)
    const signOutButton = getByText("Sign out")

    const mockSignOut = vi.fn().mockResolvedValue({ error: { message: "Sign out error" } })
    supabase.auth.signOut = mockSignOut

    fireEvent.click(signOutButton)

    expect(mockSignOut).toHaveBeenCalled()

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Sign out error")
    })
  })
})
