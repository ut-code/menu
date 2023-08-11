import { Session } from "@supabase/supabase-js"
import { SignIn } from "./SignIn"
import { SignOut } from "./SignOut"

interface Props {
  session: Session | null
}

export const Auth = (props: Props) => {
  return !props.session ? (
    <SignIn />
  ) : (
    <div>
      <p>Already logged in</p>
      <SignOut />
    </div>
  )
}
