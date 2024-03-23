import styles from "./RadioButtonCard.module.css"
import { Option } from "@/utils/questions"

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
          className={`radio-button-card ${selectedOption === option.value ? "selected" : ""}`}
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
          <label htmlFor={option.value}>{option.value}</label>
          <h6>{option.description}</h6>
        </div>
      ))}
    </div>
  )
}
