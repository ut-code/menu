import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"

import { Home } from "@/features/Home"
import { HowTo } from "@/features/HowTo"
import { Questions } from "@/features/Questions"
import { Result } from "@/features/Result"
import { Auth } from "@/features/Auth"
import { Favorite } from "@/features/Favorite"
import { NotFound } from "@/features/NotFound"
import { supabase } from "@/features/Auth/supabaseClient"

import "@/components/css/global.css"

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const userId = session?.user?.id

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

  return (
    <>
      <Routes>
        <Route path="/" element={<HowTo />}></Route>
        <Route path="/home" element={<Home userId={userId} />}></Route>
        <Route path="/home/favorites" element={<Favorite userId={userId} />}></Route>
        <Route path="/questions" element={<Questions />}></Route>
        <Route path="/search" element={<Result />}></Route>
        <Route path="/auth" element={<Auth session={session} />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  )
}
