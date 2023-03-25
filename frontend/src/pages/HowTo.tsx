import { Link } from "react-router-dom"
import "@/components/css/swiper.css"
import NextButton from "@/components/NextButton/NextButton"
import Smartphone from "@/components/Smartphone/Smartphone"

import { Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"

export default function HowTo() {
  return (
    <>
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        <SwiperSlide>
          <p className="heading">
            まずは使いたい食材を<br></br>入力してみましょう
          </p>
          <Smartphone />
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
          <p className="heading">
            まずは使いたい食材を<br></br>入力してみましょう
          </p>
          <Smartphone />
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
          <p className="heading">
            いくつかの質問に<br></br>答えてみましょう
          </p>
          <Smartphone />
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
          <p className="heading">
            あなたにぴったりの<br></br>レシピを検索可能
          </p>
          <Smartphone />
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
