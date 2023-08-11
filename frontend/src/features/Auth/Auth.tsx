import { useEffect } from "react"
// import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"

export const Auth = () => {
  const Navigate = useNavigate()
  useEffect(() => {
    Navigate("/auth/signin")
  })

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
      </div>
    </div>
  )
}
