import { Routes, Route, Navigate } from "react-router-dom"
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
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) console.log(error)
      else setSession(data.session)

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
      setIsLoading(false)
    }
    initialize()
  }, [])

  if (isLoading) return <div>loading...</div>
  return (
    <>
      <Routes>
        <Route path="/" element={<HowTo />}></Route>
        <Route path="/home" element={<Home session={session} />}></Route>
        <Route
          path="/home/favorites"
          element={session ? <Favorite session={session} /> : <Navigate replace to="/home" />}
        ></Route>
        <Route path="/questions" element={<Questions session={session} />}></Route>
        <Route path="/search" element={<Result session={session} />}></Route>
        <Route path="/auth" element={!session ? <Auth /> : <Navigate replace to="/home" />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  )
}
