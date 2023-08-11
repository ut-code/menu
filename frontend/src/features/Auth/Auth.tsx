import { Session } from "@supabase/supabase-js"
import { SignIn } from "./SignIn"
interface Props {
  session: Session | null
}

export const Auth = (props: Props) => {
  return !props.session ? <SignIn /> : <div>Already logged in</div>
}
