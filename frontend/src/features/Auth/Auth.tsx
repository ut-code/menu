import { Session } from "@supabase/supabase-js"
import { SignIn } from "./SignIn"
import { SignOut } from "./SignOut"
import { DeleteAccount } from "./DeleteAccount"

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
      <br />
      <DeleteAccount session={props.session} />
    </div>
  )
}
