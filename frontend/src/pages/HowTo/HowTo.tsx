import { Link } from "react-router-dom"

import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "./swiper.css"

import { NextButton } from "../../components/NextButton"
import one from "../../assets/image/Howto1.png"
import two from "../../assets/image/Howto2.png"
import three from "../../assets/image/Howto3.png"
import four from "../../assets/image/Howto4.png"

export const HowTo = () => {
  return (
    <Swiper
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      modules={[Pagination, Navigation]}
      navigation={{
        nextEl: "#swiper-button-next",
      }}
      pagination={true}
    >
      <SwiperSlide>
        <div className="skip">
          <Link to="/questions">
            <p>
              <b>スキップ</b>
            </p>
          </Link>
        </div>
        <img src={one} alt="アイコン" className="icon" />
        <div className="text-area">
          <h2>こんなお悩みありませんか？</h2>
          <p>
            「自炊したいけど献立考えるのはめんどくさい…」<br></br>
            「冷蔵庫の余り物が使いきれない…」
          </p>
        </div>

        <div className="bottom">
          <div id="swiper-button-next">
            <NextButton title={"次へ"} onClick={() => {}} />
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="skip">
          <Link to="/questions">
            <p>
              <b>スキップ</b>
            </p>
          </Link>
        </div>
        <img src={two} alt="アイコン" className="icon" />
        <div className="text-area">
          <h2>だるめしを使いましょう</h2>
          <p>
            操作方法はカンタン！<br></br>
            材料・調理時間などの質問に答えてボタンを押すだけ！
          </p>
        </div>
        <div className="bottom">
          <div id="swiper-button-next">
            <NextButton title={"次へ"} onClick={() => {}} />
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="skip">
          <Link to="/questions">
            <p>
              <b>スキップ</b>
            </p>
          </Link>
        </div>
        <img src={three} alt="アイコン" className="icon" />
        <div className="text-area">
          <h2>豊富なレシピ数</h2>
          <p>
            だるめしを使えば、いろんなサイトのレシピが一気に見れる<br></br>
            好きなレシピはお気に入りに保存も！
          </p>
        </div>
        <div className="bottom">
          <div id="swiper-button-next">
            <NextButton title={"次へ"} onClick={() => {}} />
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="skip">
          <Link to="/questions">
            <p>
              <b>スキップ</b>
            </p>
          </Link>
        </div>
        <img src={four} alt="アイコン" className="icon" />
        <div className="text-area">
          <h2>今日のごはん完成！</h2>
          <p>
            今日のあなたにぴったりのレシピを、<br></br>
            もっと簡単に、もっと手軽に
          </p>
        </div>
        <div className="bottom">
          <Link to="/questions">
            <NextButton title={"次へ"} onClick={() => {}} />
          </Link>
        </div>
      </SwiperSlide>
    </Swiper>
  )
}
