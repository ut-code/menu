import styles from "./RadioButtonCard.module.css"
import { Option } from "@/utils/questions"
import CheckIcon from "@mui/icons-material/Check"

interface Props {
  key: string
  option: Option // Option 型の配列
  selectedOption: string | undefined // 選択されたオプションの value を表す文字列
  handleChange: (option: string) => void // オプションの value を引数として受け取るコールバック関数
}

export const RadioButtonCard = ({ key, option, selectedOption, handleChange }: Props) => {
  return (
    <div
      key={key}
      className={`${styles.radio_button_card} ${selectedOption === option.value ? styles.selected : ""}`}
      onClick={() => handleChange(option.value)}
    >
      <div className={styles.root}>
        <div>
          <h3>{option.value}</h3>
          <h5>{option.description}</h5>
        </div>
        <div className={styles.icon}>
          {selectedOption === option.value && <CheckIcon fontSize="medium" style={{ color: "white" }} />}
        </div>
      </div>
    </div>
  )
}
