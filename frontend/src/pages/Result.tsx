import { useState, useEffect } from "react"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "@/assets/css/style.css"

export default function Result() {
  return (
    <>
      <div className="card">
        <div className="card__header">
          <h3 className="card__title">正義Tシャツ</h3>
          <figure className="card__thumbnail">
            <img
              src="https://shibajuku.net/wp/wp-content/uploads/2020/02/seigiT.jpg"
              alt="手書きの「正義」という文字が縦に大きくマジックで書かれている白いTシャツ"
              className="card__image"
            />
          </figure>
        </div>
        <div className="card__body">
          <p className="card__text">
            ごく普通の生地の白いTシャツに油性マジックで「正義」と書いただけの架空の半袖Tシャツです。
          </p>
          <p className="card__text -number">&yen; 15,000</p>
        </div>
        <div className="card__footer">
          <p className="card__text">
            <a href="#" className="button -compact">
              正義Tシャツの詳細を見る
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
