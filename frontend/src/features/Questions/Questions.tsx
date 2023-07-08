import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import { Hamburger } from "@/components/Hamburger"
import { NextButton } from "@/components/elements/button/NextButton"
import { Keywords } from "./components/Keywords"
import { RadioGroup } from "./components/RadioGroup"
import { QuestionGroup } from "./components/QuestionGroup"

// 画像ファイルをimport
import imgBroccoli from "@/assets/image/broccoli.webp"
import imgEgg from "@/assets/image/egg.webp"
import imgMilk from "@/assets/image/milk.webp"
import imgPork from "@/assets/image/pork.webp"
import imgTomato from "@/assets/image/tomato.webp"
import imgOnion from "@/assets/image/onion.webp"
import imgCarrot from "@/assets/image/carrot.webp"
import imgChicken from "@/assets/image/chicken.jpg"
import imgLettuce from "@/assets/image/lettuce.webp"
import imgPotato from "@/assets/image/potato.webp"
import imgTofu from "@/assets/image/tofu.webp"
import imgShiiTake from "@/assets/image/shiitake.webp"
import imgEggPlant from "@/assets/image/eggplant.webp"
import imgBeanSprout from "@/assets/image/moyashi.webp"
import imgCabbage from "@/assets/image/cabbage.webp"
import imgDaikon from "@/assets/image/daikon.webp"
import imgGobou from "@/assets/image/burdock.webp"

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

type foodsType = {
  choiceText: string
  choiceImage: string
}

const foods: foodsType[] = [
  { choiceText: "卵", choiceImage: imgEgg },
  { choiceText: "トマト", choiceImage: imgTomato },
  { choiceText: "ブロッコリー", choiceImage: imgBroccoli },
  { choiceText: "牛乳", choiceImage: imgMilk },
  { choiceText: "玉ねぎ", choiceImage: imgOnion },
  { choiceText: "人参", choiceImage: imgCarrot },
  { choiceText: "鶏肉", choiceImage: imgChicken },
  { choiceText: "レタス", choiceImage: imgLettuce },
  { choiceText: "じゃがいも", choiceImage: imgPotato },
  { choiceText: "豆腐", choiceImage: imgTofu },
  { choiceText: "しいたけ", choiceImage: imgShiiTake },
  { choiceText: "豚肉", choiceImage: imgPork },
  { choiceText: "なす", choiceImage: imgEggPlant },
  { choiceText: "もやし", choiceImage: imgBeanSprout },
  { choiceText: "キャベツ", choiceImage: imgCabbage },
  { choiceText: "大根", choiceImage: imgDaikon },
  { choiceText: "ごぼう", choiceImage: imgGobou },
]

//ランダムに重複なく４つの選択肢を選ぶ これで { choiceText: "ごぼう", choiceImage: imgGobou }みたいなデータが４つ入った配列ができるはず
const shuffle = (array: foodsType[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1))
    const temp: foodsType = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array.slice(0, 4)
}

const randomFoods: foodsType[] = shuffle(foods)

const questions: Question[] = [
  {
    questionNumber: 0,
    questionText: "使いたい食材はなんですか？",
    userInput: true,
    choices: {
      0: { choiceText: randomFoods[0].choiceText, choiceImage: randomFoods[0].choiceImage },
      1: { choiceText: randomFoods[1].choiceText, choiceImage: randomFoods[1].choiceImage },
      2: { choiceText: randomFoods[2].choiceText, choiceImage: randomFoods[2].choiceImage },
      3: { choiceText: randomFoods[3].choiceText, choiceImage: randomFoods[3].choiceImage },
    },
  },
  {
    questionNumber: 1,
    questionText: "料理のジャンルを選択してください",
    userInput: false,
    choices: {
      0: { choiceText: "主食", choiceImage: "" },
      1: { choiceText: "主菜・副菜", choiceImage: "" },
      2: { choiceText: "汁物", choiceImage: "" },
      3: { choiceText: "その他", choiceImage: "" },
    },
  },
  {
    questionNumber: 2,
    questionText: "調理時間を選択してください",
    userInput: false,
    choices: {
      0: { choiceText: "時短", choiceImage: "" },
      1: { choiceText: "普通", choiceImage: "" },
      2: { choiceText: "じっくり", choiceImage: "" },
    },
  },
  {
    questionNumber: 3,
    questionText: "他に使いたい食材はありますか？",
    userInput: true,
    choices: {
      0: { choiceText: "豚肉", choiceImage: imgPork },
    },
  },
]
type Answer = {
  answerNumber: number
  content: string
}

export const Questions = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0])
  const [inputContent, setInputContent] = useState<string>("")
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false)

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
  // currentQuestionの変更をフックにして回答状況を復元
  //----------------------------------------------------------------
  useEffect(() => {
    const answer = localStorage.getItem("answer-" + currentQuestion.questionNumber.toString())
    if (answer !== null) {
      setInputContent(answer)
    }
  }, [currentQuestion])

  //----------------------------------------------------------------
  // 選択肢のボタンが押されたとき / 入力欄に入れたときの処理
  //----------------------------------------------------------------
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 選んだ選択肢をinputContentにセット
    setInputContent(e.target.value)

    // 問題番号をキーにして、選んだ選択肢をlocalStorageに保存
    localStorage.setItem("answer-" + currentQuestion.questionNumber.toString(), e.target.value)
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
  const onClickResultPage = () => {
    Navigate("/result")
  }

  //----------------------------------------------------------------
  // ハンバーガーを開く・閉じる
  //----------------------------------------------------------------
  const onClickOpenHamburger = () => {
    setIsOpenHamburger(true)
  }
  const onClickCloseHamburger = () => {
    setIsOpenHamburger(false)
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
      <div key={currentQuestion.questionNumber}>
        <QuestionGroup
          questionNumber={currentQuestion.questionNumber}
          questionText={currentQuestion.questionText}
          userInput={currentQuestion.userInput}
          onClickPreviousPage={onClickPreviousPage}
          onClickOpenHamburger={onClickOpenHamburger}
          onClickResultPage={onClickResultPage}
          onChange={onChangeHandler}
          inputContent={inputContent}
          placeholder="食材の名前を入力してみましょう"
        />

        <div className="style_lightbrown">
          {isOpenHamburger === true && <Hamburger onClickCloseHamburger={onClickCloseHamburger} />}
          {currentQuestion.userInput === false && <Keywords answers={answers} />}

          <RadioGroup
            options={currentQuestion.choices}
            onChange={onChangeHandler}
            inputContent={inputContent}
            userInput={currentQuestion.userInput}
          />

          <NextButton onClick={onClickNextPage} />
        </div>
      </div>
    </>
  )
}
