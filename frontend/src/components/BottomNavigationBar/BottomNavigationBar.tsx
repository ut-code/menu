import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import Paper from "@mui/material/Paper"
import SearchIcon from "@mui/icons-material/Search"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import EditIcon from "@mui/icons-material/Edit"
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"
import FavoriteIcon from "@mui/icons-material/Favorite"
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { styled } from "@mui/material/styles"

const StyledBottomNavigationAction = styled(BottomNavigationAction)(() => ({
  color: "#C4C4C4",
  "&.Mui-selected": {
    color: "#000000",
  },
}))

export const BottomNavigationBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState(location.pathname)
  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setValue(newValue)
    navigate(newValue)
  }

  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, paddingTop: 1.5 }} elevation={3}>
      <BottomNavigation showLabels={true} value={value} onChange={handleChange}>
        <StyledBottomNavigationAction label="検索" icon={<SearchIcon />} value="/questions" />
        <StyledBottomNavigationAction
          label="作成"
          icon={value === "/new" ? <EditIcon /> : <EditOutlinedIcon />}
          value="/new"
        />
        <StyledBottomNavigationAction
          label="お気に入り"
          icon={value === "/favorites" ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
          value="/favorites"
        />
        <StyledBottomNavigationAction
          label="マイページ"
          icon={value === "/setting" ? <AccountCircleIcon /> : <AccountCircleOutlinedIcon />}
          value="/setting"
        />
      </BottomNavigation>
    </Paper>
  )
}
