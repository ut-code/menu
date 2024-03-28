import { useState } from "react"
import { useNavigate } from "react-router-dom"
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

export const BottomNavigationBar = () => {
  const [value, setValue] = useState(0)
  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setValue(newValue)
  }
  const navigate = useNavigate()

  return (
    <Paper
      sx={{ "& .MuiBottomNavigationAction-root": { color: "black" }, position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels={true} value={value} onChange={handleChange}>
        <BottomNavigationAction label="検索" icon={<SearchIcon />} onClick={() => navigate("/questions")} />
        <BottomNavigationAction
          label="作成"
          icon={value === 1 ? <EditIcon /> : <EditOutlinedIcon />}
          onClick={() => navigate("/new")}
        />
        <BottomNavigationAction
          label="お気に入り"
          icon={value === 2 ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
          onClick={() => navigate("/favorites")}
        />
        <BottomNavigationAction
          label="マイページ"
          icon={value === 3 ? <AccountCircleIcon /> : <AccountCircleOutlinedIcon />}
          onClick={() => navigate("/setting")}
        />
      </BottomNavigation>
    </Paper>
  )
}
