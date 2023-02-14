import { useState, useEffect } from "react"

import "@/assets/css/style.css"
import "@/assets/css/card.css"

export default function Result() {
  return (
    <>
      <a href="/home">ホーム</a>
      <div className="style1">
        <div className="card">
          <div className="card__imgframe"></div>
          <div className="card__textbox">
            <div className="card__titletext">タイトルがはいります。タイトルがはいります。</div>
            <div className="card__overviewtext">
              概要がはいります。概要がはいります。概要がはいります。概要がはいります。
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
