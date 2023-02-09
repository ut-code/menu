import "@/assets/css/style.css"

export default function Home() {
  return (
    <>
      <div className="style1">
        <div className="howToPlay">?</div>
        <h1>使いたい食材はなんですか？</h1>
        <p>食材の名前を入力してみましょう</p>
        <div className="inputIngredient">a</div>
        <div className="suggestIngredient">
          <div className="box">季節の野菜1</div>
          <div className="box">季節の野菜2</div>
          <div className="box">季節の野菜3</div>
          <div className="box">季節の野菜4</div>
        </div>
        <div className="nextButton">Next</div>
      </div>
      <a href="/message">掲示板</a>
    </>
  )
}
