import { render, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import { Session } from "@supabase/supabase-js"
import { DeleteAccount } from "./DeleteAccount"
import { supabase } from "../supabaseClient"
import { UserContext } from "@/utils/context"

beforeAll(() => {
  window.alert = vi.fn()
})

describe("DeleteAccount component", () => {
  it("DeleteAccount component disables button during deletion", () => {
    const { getByText } = render(
      <UserContext.Provider value={{ user: null, session: null }}>
        <DeleteAccount />
      </UserContext.Provider>
    )

    const deleteButton = getByText("Delete Account")
    expect(deleteButton).toBeInTheDocument()

    fireEvent.click(deleteButton)

    const loadingText = getByText("Loading")
    expect(loadingText).toBeInTheDocument()
  })

  it("should handle delete account and show error alerts", async () => {
    const mockSession = { user: { id: "user_id" } } as Session
    const { getByText } = render(
      <UserContext.Provider value={{ user: null, session: mockSession }}>
        <DeleteAccount />
      </UserContext.Provider>
    )
    const deleteButton = getByText("Delete Account")

    vi.mock("../supabaseClient", () => ({
      supabase: {
        from: vi.fn(() => ({
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ error: { message: "Delete error" } }),
        })),
        auth: {
          signOut: vi.fn().mockResolvedValue({ error: { message: "Sign out error" } }),
        },
      },
    }))

    fireEvent.click(deleteButton)
    expect(supabase.from).toHaveBeenCalledWith("Users")
    // expect(supabase.from("Users").delete().eq).toHaveBeenCalledWith("id", "user_id")
    expect(supabase.auth.signOut).toHaveBeenCalled()

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Delete error")
      expect(window.alert).toHaveBeenCalledWith("Sign out error")
    })
  })
})
