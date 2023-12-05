import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { User } from "@/utils/users"
import { getUserApi } from "@/utils/apiUtils"
import { UserContext } from "@/utils/context"

import { Home } from "@/features/Home"
import { HowTo } from "@/features/HowTo"
import { Questions } from "@/features/Questions"
import { Result } from "@/features/Result"
import { Auth } from "@/features/Auth"
import { Favorite } from "@/features/Favorite"
import { Seasonal } from "@/features/Seasonal"
import { Setting } from "@/features/Setting"
import { NotFound } from "@/features/NotFound"
import { supabase } from "@/features/Auth/supabaseClient"

import "@/components/css/global.css"
import { Loading } from "./components/Loading"

export default function App() {
  // Ref: https://mixblog.vercel.app/contents/next-supabase
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const location = useLocation()

  useEffect(() => {
    const fetchUser = async (session: Session | null): Promise<User | null> => {
      if (!session?.access_token) return null
      const response = await fetch(getUserApi(), {
        headers: { authorization: `Bearer ${session?.access_token}` },
      })
      const user = await response.json()
      return user
    }

    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) console.log(error)
      else setSession(data.session)

      const user = await fetchUser(data.session)
      setUser(user)

      supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session)
        const user = await fetchUser(session)
        setUser(user)
      })
      setIsLoading(false)
    }
    initialize()
  }, [])

  if (isLoading) return <Loading />
  return (
    <UserContext.Provider value={{ user, session }}>
      <Routes>
        <Route path="/" element={location.search !== "?ref=a2hs" ? <HowTo /> : <Navigate replace to="/questions" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/favorites" element={session ? <Favorite /> : <Navigate replace to="/home" />} />
        <Route path="/home/seasonal" element={<Seasonal />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/search" element={<Result session={session} />} />
        <Route path="/setting" element={<Setting setUser={setUser} />} />
        <Route path="/auth" element={!session ? <Auth /> : <Navigate replace to="/home" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserContext.Provider>
  )
}
