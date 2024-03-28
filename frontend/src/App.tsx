import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { useLocalStorage } from "react-use"

import { User, updateUsername } from "@/utils/users"
import { getUserApi } from "@/utils/apiUtils"
import { UserContext } from "@/utils/context"
import { HowTo } from "@/features/HowTo"
import { Questions } from "@/features/Questions"
import { Result } from "@/features/Result"
import { Auth } from "@/features/Auth"
import { Favorite } from "@/features/Favorite"
import { Setting } from "@/features/Setting"
import { NewRecipes } from "@/features/NewRecipes"
import { NotFound } from "@/features/NotFound"
import { supabase } from "@/features/Auth/supabaseClient"

import "./App.css"
import { Loading } from "./components/Loading"

export default function App() {
  // Ref: https://mixblog.vercel.app/contents/next-supabase
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [inputUsername, setInputUsername] = useLocalStorage("inputUsername", "")
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

        const fetchedUser = await fetchUser(session)
        if (fetchedUser) {
          setUser(fetchedUser)
        }
        const username = await updateUsername({ user, session }, inputUsername)
        if (username && fetchedUser) {
          setInputUsername(username)
          setUser({ ...fetchedUser, username: username })
        }
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
        <Route path="/home/favorites" element={<Favorite />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/search" element={<Result />} />
        <Route path="/setting" element={<Setting />} />
        <Route
          path="/auth"
          element={
            !session ? (
              <Auth inputUsername={inputUsername} setInputUsername={setInputUsername} />
            ) : (
              <Navigate replace to="/home" />
            )
          }
        />
        <Route path="/new" element={<NewRecipes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserContext.Provider>
  )
}
