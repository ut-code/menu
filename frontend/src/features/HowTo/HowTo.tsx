import { useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { NextButton } from "@/components/elements/button/NextButton"
import { Smartphone } from "./components/Smartphone"

import "@/components/css/swiper.css"
import { Pagination, type Swiper as SwiperRef } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"

/* import image */
import img1 from "@/assets/image/howto1.png"
import img2 from "@/assets/image/howto2.png"
import img3 from "@/assets/image/howto3.png"
import icon from "@/assets/image/icon.png"

export const HowTo = () => {
  const swiperRef = useRef<SwiperRef>()
  const Navigate = useNavigate()

  return (
    <>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        pagination={true}
        modules={[Pagination]}
      >
        <SwiperSlide>
          <div className="title_div">
            <p className="description">質問に答えていくだけで献立を提案してくれるアプリ</p>
            <h1 className="title">だるめし</h1>
          </div>
          <img src={icon} alt="アイコン" className="icon" />
          <div className="bottom">
            <NextButton onClick={() => swiperRef.current?.slideNext()} />
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
            <NextButton onClick={() => swiperRef.current?.slideNext()} />
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
            <NextButton onClick={() => swiperRef.current?.slideNext()} />
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
            <NextButton onClick={() => Navigate("/home")} />
            <Link to={"/home"} className="skip">
              Skip
            </Link>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  )
}
