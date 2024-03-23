import styles from "./RadioButtonCard.module.css"

interface Option {
  value: string // 仮に value が string 型であると仮定
  label: string // 仮に label が string 型であると仮定
  description: string // 仮に description が string 型であると仮定
}

interface Props {
  options: Option[] // Option 型の配列
  selectedOption: string // 選択されたオプションの value を表す文字列
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
          <label htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
    </div>
  )
}
