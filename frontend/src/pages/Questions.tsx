import { useState, useEffect } from "react"

import "@/assets/css/style.css"
import "@/assets/css/home.css"

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

//----------------------------------------------------------------
// 質問を配列で定義
//----------------------------------------------------------------
const questions: Question[] = [
  {
    questionNumber: 0,
    questionText: "使いたい食材・調味料は何ですか？",
    userInput: true,
    choices: {
      1: "トマト",
      2: "ブロッコリー",
      3: "牛乳",
      4: "卵",
    },
  },
  {
    questionNumber: 1,
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
    questionNumber: 2,
    questionText: "調理時間はどのくらいかけられますか？",
    userInput: false,
    choices: {
      1: "時短",
      2: "普通",
      3: "じっくり",
    },
  },
  {
    questionNumber: 3,
    questionText: "他に使いたい食材・調味料はありますか？",
    userInput: true,
    choices: {
      1: "ここどうしよう",
    },
  },
]

export default function Questions() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0])
  const [style, setStyle] = useState<string>("style1")
  const [box, setBox] = useState<string>("box")

  //----------------------------------------------------------------
  // currentQuestionの変更をフックにする
  // userInput が true なら className="style1" をセット
  //----------------------------------------------------------------
  useEffect(() => {
    if (currentQuestion.userInput === true) {
      setStyle("style1")
    } else {
      setStyle("style2")
    }
  }, [currentQuestion])

  //----------------------------------------------------------------
  // currentQuestionの変更をフックにする
  // questionNumber が 0以外 なら box2 をセット
  //----------------------------------------------------------------
  useEffect(() => {
    if (currentQuestion.questionNumber === 0) {
      setBox("box2")
    } else {
      setBox("box")
    }
  }, [currentQuestion])

  //----------------------------------------------------------------
  // 選択肢のボタンが押されたときの処理
  //----------------------------------------------------------------
  const onClickHandler = (index: number) => {
    // 問題番号をキーにして、選択肢の番号をlocalStorageに保存
    localStorage.setItem("answer-" + currentQuestion.questionNumber.toString(), index.toString())

    // localStorageの保存状況を確認
    const answer = localStorage.getItem("answer-" + currentQuestion.questionNumber.toString())
    alert("選択肢" + (Number(answer) + 1) + "が選択されました")
  }

  //----------------------------------------------------------------
  // 前のページ・次のページ
  //----------------------------------------------------------------
  const onClickPreviousPage = () => {
    const currentNumber = currentQuestion.questionNumber - 1
    setCurrentQuestion(questions[currentNumber])
  }
  const onClickNextPage = () => {
    // localStorageの保存状況を確認
    const answer = localStorage.getItem("answer-" + currentQuestion.questionNumber.toString())
    if (answer === null) {
      alert("選択肢を選んでください")
      return
    }

    const currentNumber = currentQuestion.questionNumber + 1
    if (currentNumber === questions.length) {
      // あとで変更する
      window.location.href = "/home"
    }
    setCurrentQuestion(questions[currentNumber])
  }

  return (
    <>
      <div className={style}>
        {currentQuestion.questionNumber === 0 && <div className="howToPlay">?</div>}
        {currentQuestion.questionNumber > 0 && (
          <div className="backButton" onClick={onClickPreviousPage}>
            ＜
          </div>
        )}
        {style === "style2" && (
          <div className="tmpImage">
            <img src="https://placehold.jp/600x150.png" alt="tmpImage" />
          </div>
        )}
        <div className="question">{currentQuestion.questionText}</div>
        {currentQuestion.userInput === true && <div className="letsInputIngredient"></div>}
        {currentQuestion.userInput === true && (
          <div className="inputIngredient">
            <input type="text" placeholder="食材の名前を入力してみましょう" />
          </div>
        )}
        <div className="suggestIngredient">
          {Object.values(currentQuestion.choices).map((choice, index) => (
            <button className={box} key={index} onClick={() => onClickHandler(index)}>
              {choice}
            </button>
          ))}
        </div>
        <div className="nextButton" onClick={onClickNextPage}>
          Next
        </div>
      </div>
    </>
  )
}
