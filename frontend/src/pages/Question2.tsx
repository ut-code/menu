import "@/assets/css/style.css"

export default function Question2() {
  return (
    <>
      <div className="style2">
        <div className="backButton">＜</div>
        <div className="tmpImage">
          <img src="https://placehold.jp/600x150.png" alt="tmpImage" />
        </div>
        <p className="question">Question</p>
        <div className="suggestIngredient">
          <div className="box">主食</div>
          <div className="box">主菜・副菜</div>
          <div className="box">デザート</div>
          <div className="box">スープ</div>
        </div>
        <div className="nextButton">Next</div>
      </div>
      <a href="/message">掲示板</a>
      <br></br>
      <a href="/home">ホーム</a>
    </>
  )
}
