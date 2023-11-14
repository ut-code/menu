import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"

import { Home } from "@/features/Home"
import { HowTo } from "@/features/HowTo"
import { Questions } from "@/features/Questions"
import { Result } from "@/features/Result"
import { Auth } from "@/features/Auth"
import { Favorite } from "@/features/Favorite"
import { Seasonal } from "@/features/Seasonal"
import { NotFound } from "@/features/NotFound"
import { supabase } from "@/features/Auth/supabaseClient"

import "@/components/css/global.css"
import { Loading } from "./components/Loading"

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const location = useLocation()

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

  if (isLoading) return <Loading />
  return (
    <>
      <Routes>
        <Route path="/" element={location.search !== "?ref=a2hs" ? <HowTo /> : <Navigate replace to="/questions" />} />
        <Route path="/home" element={<Home session={session} />} />
        <Route
          path="/home/favorites"
          element={session ? <Favorite session={session} /> : <Navigate replace to="/home" />}
        />
        <Route path="/home/seasonal" element={<Seasonal session={session} />} />
        <Route path="/questions" element={<Questions session={session} />} />
        <Route path="/search" element={<Result session={session} />} />
        <Route path="/auth" element={!session ? <Auth /> : <Navigate replace to="/home" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
