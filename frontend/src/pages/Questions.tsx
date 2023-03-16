import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import Suggestion from "@/components/suggestion"
import HeaderHowTo from "@/components/HeaderHowTo"
import BackButton from "@/components/BackButton"
import NextButton from "@/components/NextButton"
import QuestionText from "@/components/QuestionText"
import "@/assets/css/home.css"
import "@/assets/css/choice.css"

// 画像ファイルをimport
import imgBroccoli from "@/assets/image/broccoli.webp"
import imgEgg from "@/assets/image/egg.webp"
import imgMilk from "@/assets/image/milk.webp"
import imgPork from "@/assets/image/pork.webp"
import imgTomato from "@/assets/image/tomato.webp"

//----------------------------------------------------------------
// 参考
// https://dev.classmethod.jp/articles/react-survey-app-to-proceed-to-the-next-question-without-having-to-reload-the-page/
//----------------------------------------------------------------

type Choices = {
  [key: number]: {
    choiceText: string
    choiceImage: string
  }
}

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
    questionText: "使いたい食材はなんですか？",
    userInput: true,
    choices: {
      1: { choiceText: "トマト", choiceImage: imgTomato },
      2: { choiceText: "ブロッコリー", choiceImage: imgBroccoli },
      3: { choiceText: "牛乳", choiceImage: imgMilk },
      4: { choiceText: "卵", choiceImage: imgEgg },
    },
  },
  {
    questionNumber: 1,
    questionText: "料理のジャンルを選択してください",
    userInput: false,
    choices: {
      1: { choiceText: "主食", choiceImage: "" },
      2: { choiceText: "主菜・副菜", choiceImage: "" },
      3: { choiceText: "汁物", choiceImage: "" },
      4: { choiceText: "その他", choiceImage: "" },
    },
  },
  {
    questionNumber: 2,
    questionText: "調理時間を選択してください",
    userInput: false,
    choices: {
      1: { choiceText: "時短", choiceImage: "" },
      2: { choiceText: "普通", choiceImage: "" },
      3: { choiceText: "じっくり", choiceImage: "" },
    },
  },
  {
    questionNumber: 3,
    questionText: "他に使いたい食材はありますか？",
    userInput: true,
    choices: {
      1: { choiceText: "豚肉", choiceImage: imgPork },
    },
  },
]

type Answer = {
  answerNumber: number
  content: string
}

export default function Questions() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0])
  const [inputContent, setInputContent] = useState<string>("")
  const [style, setStyle] = useState<string>("style1")
  const [box, setBox] = useState<string>("box_brown")
  const [answers, setAnswers] = useState<Answer[]>([])

  // useNavigate を Navigate に変化させる呪文
  const Navigate = useNavigate()

  //----------------------------------------------------------------
  // localStorage を使って inputContent と currentQuestion を設定する
  //----------------------------------------------------------------
  useEffect(() => {
    for (let i = 0; i < questions.length; i++) {
      const answer = localStorage.getItem("answer-" + i.toString())
      if (answer !== null) {
        setCurrentQuestion(questions[i])
        setInputContent(answer)
      }
    }
  }, [])

  //----------------------------------------------------------------
  // CSS用の関数
  // userInput が true なら className="style1" をセット
  // questionNumber が 0以外 なら box-pic をセット
  //----------------------------------------------------------------
  const changeStyles = () => {
    if (currentQuestion.userInput === true) {
      setStyle("style1")
    } else {
      setStyle("style2")
    }

    if (currentQuestion.userInput === true) {
      setBox("box_pic")
    } else {
      setBox("box")
    }
  }

  //----------------------------------------------------------------
  // currentQuestionの変更をフックにして回答状況を復元
  //----------------------------------------------------------------
  useEffect(() => {
    changeStyles()

    const answer = localStorage.getItem("answer-" + currentQuestion.questionNumber.toString())
    if (answer !== null) {
      setInputContent(answer)
    }
  }, [currentQuestion])

  //----------------------------------------------------------------
  // 選択肢のボタンが押されたときの処理
  //----------------------------------------------------------------
  const onChangeHandler = (index: number) => {
    // 選んだ選択肢をinputContentにセット (0-indexed を 1-indexed に変換)
    setInputContent(currentQuestion.choices[index + 1].choiceText)

    // 問題番号をキーにして、選んだ選択肢をlocalStorageに保存
    localStorage.setItem(
      "answer-" + currentQuestion.questionNumber.toString(),
      currentQuestion.choices[index + 1].choiceText
    )

    // localStorageの保存状況を確認
    // const answer = localStorage.getItem("answer-" + currentQuestion.questionNumber.toString())
    // const answer = currentQuestion.choices[index + 1]
    // alert("選択肢「" + answer + "」が選択されました")
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
    if (inputContent === "") {
      alert("選択肢を選んでください")
      return
    } else {
      localStorage.setItem("answer-" + currentQuestion.questionNumber.toString(), inputContent)
    }
    setInputContent("")

    const currentNumber = currentQuestion.questionNumber + 1
    if (currentNumber === questions.length) {
      Navigate("/result")
    }
    setCurrentQuestion(questions[currentNumber])
  }

  useEffect(() => {
    // localStorageから解答を取り出してanswersに入れる
    const newAnswers: Answer[] = []
    for (let i = 0; i < questions.length; i++) {
      const answer = localStorage.getItem("answer-" + i.toString())
      if (answer !== null) {
        // addAnswer({ answerNumber: i, content: answer })
        newAnswers.push({ answerNumber: i, content: answer })
      }
    }
    setAnswers(newAnswers)
  }, [currentQuestion])

  return (
    <>
      <div className={style} key={currentQuestion.questionNumber}>
        {currentQuestion.questionNumber === 0 && <HeaderHowTo />}

        {currentQuestion.questionNumber > 0 && <BackButton onClick={onClickPreviousPage} />}

        <QuestionText content={currentQuestion.questionText} userInput={currentQuestion.userInput} />

        {currentQuestion.userInput === true && (
          <div className="inputIngredient">
            <input
              className="input"
              type="text"
              placeholder="食材の名前を入力してみましょう"
              value={inputContent}
              onChange={(e) => {
                setInputContent(e.target.value)
              }}
            />
          </div>
        )}
        {currentQuestion.userInput === false && (
          <div className="inputIngredient notInput" style={{ color: "var(--Gray)" }}>
            <span className="inputIngredient_title">Keywords&nbsp;&nbsp;</span>
            <br></br>
            <span className="inputIngredient_input">
              {answers.map((answer, index) => (
                <span key={index}>{answer.content}&nbsp;</span>
              ))}
            </span>
          </div>
        )}
        {currentQuestion.userInput === true && <div className="suggestIngredient_title">Recommend</div>}

        <div className="suggestIngredient">
          {Object.values(currentQuestion.choices).map((choice, index) => (
            <label key={index} className={box} style={{ backgroundImage: `url(${choice.choiceImage})` }}>
              <input
                type="radio"
                value={choice.choiceText}
                onChange={() => onChangeHandler(index)}
                checked={inputContent === choice.choiceText}
              />
              {currentQuestion.userInput === true && (
                <div className="heading">
                  {choice.choiceText} {1 * Number(inputContent === choice.choiceText)}
                </div>
              )}
              {currentQuestion.userInput === false && (
                <div>
                  {choice.choiceText} {1 * Number(inputContent === choice.choiceText)}
                </div>
              )}
            </label>
          ))}
        </div>

        <NextButton onClick={onClickNextPage} />
      </div>
    </>
  )
}
