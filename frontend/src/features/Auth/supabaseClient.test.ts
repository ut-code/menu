import { createClient } from "@supabase/supabase-js"

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY

describe("Supabase Client", () => {
  it("should create a supabase client", () => {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    expect(supabase).toBeDefined()
  })
})
