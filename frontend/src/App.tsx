import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { useLocalStorage } from "react-use"

import { User, updateUsername } from "@/utils/users"
import { getUserApi } from "@/utils/apiUtils"
import { UserContext } from "@/utils/context"
import { HowTo } from "@/pages/HowTo"
import { Questions } from "@/pages/Questions"
import { Result } from "@/pages/Result"
import { Auth } from "@/pages/Auth"
import { Favorite } from "@/pages/Favorite"
import { Setting } from "@/pages/Setting"
import { NewRecipe } from "@/pages/NewRecipe"
import { NotFound } from "@/pages/NotFound"
import { supabase } from "@/pages/Auth/supabaseClient"

import { Loading } from "@/components/Loading"
import { BottomNavigationBar } from "@/components/BottomNavigationBar"

import "./App.css"

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
        <Route path="/favorites" element={<Favorite />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/result" element={<Result />} />
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
        <Route path="/new" element={<NewRecipe />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNavigationBar />
    </UserContext.Provider>
  )
}
