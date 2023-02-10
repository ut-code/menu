import { useState } from "react"

//----------------------------------------------------------------
// 参考
// https://dev.classmethod.jp/articles/react-survey-app-to-proceed-to-the-next-question-without-having-to-reload-the-page/
//----------------------------------------------------------------
type Choices = { [key: number]: string }

type Question = {
  questionNumber: number
  questionText: string
  userInput: boolean
  choices: Choices
}

const questions: Question[] = [
  {
    questionNumber: 1,
    questionText: "使いたい食材・調味料は何ですか？",
    userInput: true,
    choices: {
      1: "季節の野菜1",
      2: "季節の野菜2",
      3: "季節の野菜3",
      4: "季節の野菜4",
    },
  },
  {
    questionNumber: 2,
    questionText: "分類はどれですか？",
    userInput: false,
    choices: {
      1: "主食",
      2: "主菜・副菜",
      3: "汁物",
      4: "その他",
    },
  },
  {
    questionNumber: 3,
    questionText: "調理時間はどのくらいかけられますか？",
    userInput: false,
    choices: {
      1: "時短",
      2: "普通",
      3: "じっくり",
    },
  },
  {
    questionNumber: 4,
    questionText: "他に使いたい食材・調味料はありますか？",
    userInput: true,
    choices: {
      1: "tmp1",
    },
  },
]

export default function Questions() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0])

  const onClickHandler = () => {
    const currentNumber = currentQuestion.questionNumber
    if (currentNumber === questions.length) {
      window.location.href = "/home"
    }
    setCurrentQuestion(questions[currentNumber])
  }

  return (
    <>
      <div>
        {"質問 " + currentQuestion.questionNumber + "/" + questions.length + ": " + currentQuestion.questionText}
      </div>
      {Object.values(currentQuestion.choices).map((choice, index) => (
        <button key={index} onClick={onClickHandler}>
          {choice}
        </button>
      ))}
    </>
  )
}
