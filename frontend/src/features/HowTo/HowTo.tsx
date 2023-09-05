import { Link } from "react-router-dom"

import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "./swiper.css"

import { NextButton } from "@/components/elements/button/NextButton"
import icon from "@/assets/image/icon.png"

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
        <img src={icon} alt="アイコン" className="icon" />
        こんな悩みありませんか？
        <div className="bottom">
          <div id="swiper-button-next">
            <NextButton />
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <img src={icon} alt="アイコン" className="icon" />
        だるめしを使いましょう
        <div className="bottom">
          <div id="swiper-button-next">
            <NextButton />
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <img src={icon} alt="アイコン" className="icon" />
        豊富なレシピ数
        <div className="bottom">
          <div id="swiper-button-next">
            <NextButton />
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <img src={icon} alt="アイコン" className="icon" />
        今日のごはん完成！
        <div className="bottom">
          <Link to="/home">
            <NextButton />
          </Link>
        </div>
      </SwiperSlide>
    </Swiper>
  )
}
