import { Link } from "react-router-dom"

interface Props {
  isLoggedIn: boolean
}

export const Favorite = (props: Props) => {
  return (
    <>
      {props.isLoggedIn ? (
        <h1>Favorite</h1>
      ) : (
        <div>
          <h1>Sign In to view your favorite</h1>
          <Link to="/auth">
            <button>Sign In</button>
          </Link>
        </div>
      )}
    </>
  )
}
