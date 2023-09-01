import { render, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { vi } from "vitest"
import { MemoryRouter } from "react-router-dom"

import { Auth } from "./Auth"
import { supabase } from "./supabaseClient"

beforeAll(() => {
  vi.mock("../supabaseClient")
  window.alert = vi.fn()
})

describe("SignIn component", () => {
  it("should handle form submission and show success alert", async () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    )
    const emailInput = getByPlaceholderText("メールアドレスを入力してください")
    const sendButton = getByText("サインイン")

    const mockSignInWithOtp = vi.fn().mockResolvedValue({ error: null })
    supabase.auth.signInWithOtp = mockSignInWithOtp

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.click(sendButton)

    expect(mockSignInWithOtp).toHaveBeenCalledWith({ email: "test@example.com" })

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Check your email for the login link!")
    })
  })

  it("should handle Google sign-in button click and show error alert", async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    )
    const googleSignInButton = getByText("Googleアカウントで続ける")

    const mockSignInWithOAuth = vi.fn().mockResolvedValue({ error: { message: "Google sign-in error" } })
    supabase.auth.signInWithOAuth = mockSignInWithOAuth

    fireEvent.click(googleSignInButton)

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Google sign-in error")
    })
  })
})
