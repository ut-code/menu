import { supabase } from "../supabaseClient"
import Grid from "@mui/material/BottomNavigation"
import { NextButton } from "@/components/elements/button/NextButton"

export const SignOut = () => {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) alert(error.message)
  }

  return (
    <Grid style={{ marginTop: 16 }}>
      <NextButton title="サインアウト" onClick={handleSignOut} />
    </Grid>
  )
}
