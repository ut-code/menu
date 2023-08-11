import { Session } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"
import { SignIn } from "./SignIn"

interface Props {
  session: Session | null
}

export const Auth = (props: Props) => {
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.log(error.message)
  }

  return !props.session ? (
    <SignIn />
  ) : (
    <div>
      <p>Already logged in</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}
