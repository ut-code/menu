import styles from "./RadioButtonCard.module.css"
import { Option } from "@/utils/questions"
import CheckIcon from "@mui/icons-material/Check"

interface Props {
  options: Option[] // Option 型の配列
  selectedOption: string | undefined // 選択されたオプションの value を表す文字列
  handleChange: (option: string) => void // オプションの value を引数として受け取るコールバック関数
}

export const RadioButtonCard = ({ options, selectedOption, handleChange }: Props) => {
  return (
    <div className={styles.radio}>
      {options.map((option) => (
        <div
          key={option.value}
          className={`${styles.radio_button_card} ${selectedOption === option.value ? styles.selected : ""}`}
          onClick={() => handleChange(option.value)}
        >
          <input
            type="radio"
            id={option.value}
            name="radioButton"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={() => handleChange(option.value)}
          />
          <label htmlFor={option.value}>
            <div className={styles.root}>
              <div>
                <h3>{option.value}</h3>
                <h6>{option.description}</h6>
              </div>
              <div className={styles.icon}>
                {selectedOption === option.value && <CheckIcon fontSize="medium" style={{ color: "white" }} />}
              </div>
            </div>
          </label>
        </div>
      ))}
    </div>
  )
}
