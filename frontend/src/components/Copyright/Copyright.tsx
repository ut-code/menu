import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import styles from "./Copyright.module.css"

export default function Copyright() {
  return (
    <div className={styles.copyright}>
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://utcode.net/">
          ut.code();
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </div>
  )
}
