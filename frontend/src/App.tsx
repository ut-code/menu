import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"

import { Home } from "@/features/Home"
import { HowTo } from "@/features/HowTo"
import { Questions } from "@/features/Questions"
import { Result } from "@/features/Result"
import { Auth } from "@/features/Auth"
import { SignIn } from "@/features/Auth/SignIn"
import { supabase } from "@/features/Auth/supabaseClient"

import "@/components/css/global.css"

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) console.log(error)
      else setSession(data.session)

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }
    initialize()
  }, [])

  useEffect(() => {
    console.log(session)
  }, [session])

  return (
    <>
      <Routes>
        <Route path="/" element={<HowTo />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/questions" element={<Questions />}></Route>
        <Route path="/result" element={<Result />}></Route>
        <Route path="/auth" element={<Auth />}>
          <Route path="signin" element={<SignIn />}></Route>
        </Route>
      </Routes>
    </>
  )
}
