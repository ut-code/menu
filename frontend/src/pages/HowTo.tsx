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
          <p>まずは使いたい食材を入力してみましょう</p>
          <Smartphone />
          <NextButton
            onClick={function (): void {
              throw new Error("Function not implemented.")
            }}
          />
          <Link to={"/home"}>Skip</Link>
        </SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
    </>
  )
}
