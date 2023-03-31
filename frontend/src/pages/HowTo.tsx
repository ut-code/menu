import { Link } from "react-router-dom"
import "@/components/css/swiper.css"
import NextButton from "@/components/NextButton/NextButton"
import Smartphone from "@/components/Smartphone/Smartphone"

import { Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"

/* import image */
import img1 from "@/assets/image/howto1.png"
import img2 from "@/assets/image/howto2.png"
import img3 from "@/assets/image/howto3.png"
import icon from "@/assets/image/icon.png"

export default function HowTo() {
  return (
    <>
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        <SwiperSlide>
          <div className="title_div">
            <p className="description">質問に答えていくだけで献立を提案してくれるアプリ</p>
            <h1 className="title">だるめし</h1>
          </div>
          <img src={icon} alt="アイコン" className="icon" />
          <div className="bottom">
            <NextButton
              onClick={function (): void {
                throw new Error("Function not implemented.")
              }}
            />
            <Link to={"/home"} className="skip">
              Skip
            </Link>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="text_div">
            <p className="heading">
              まずは使いたい食材を<br></br>入力してみましょう
            </p>
          </div>
          <Smartphone img={img1} />
          <div className="bottom">
            <NextButton
              onClick={function (): void {
                throw new Error("Function not implemented.")
              }}
            />
            <Link to={"/home"} className="skip">
              Skip
            </Link>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="text_div">
            <p className="heading">
              いくつかの質問に<br></br>答えてみましょう
            </p>
          </div>
          <Smartphone img={img2} />
          <div className="bottom">
            <NextButton
              onClick={function (): void {
                throw new Error("Function not implemented.")
              }}
            />
            <Link to={"/home"} className="skip">
              Skip
            </Link>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="text_div">
            <p className="heading">
              あなたにぴったりの<br></br>レシピを検索可能
            </p>
          </div>
          <Smartphone img={img3} />
          <div className="bottom">
            <NextButton
              onClick={function (): void {
                throw new Error("Function not implemented.")
              }}
            />
            <Link to={"/home"} className="skip">
              Skip
            </Link>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  )
}
