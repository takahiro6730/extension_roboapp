import { useState } from "react"

import "./style.css"
import ApiReg from "./apiReg"

function IndexPopup() {
  // const [data, setData] = useState("")
  const [showApiReg, setShowApiReg] = useState(false)
  if (showApiReg) {
    return <ApiReg onBack={() => setShowApiReg(false)}/>;
  }
  return (
    <div className="font-sans">
      <div className="w-[350px] text-2xl bg-black text-white text-center p-2">
        Robosell
      </div>
      <div className="bg-amber-100 py-4">
        <div className="flex justify-center p-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base">自動入力</button>
        </div>
        <div className="flex justify-center p-2">
          <label className="w-full flex items-center cursor-pointer justify-center">
            <span className="ms-3 text-lg text-gray-900 font-bold mr-4">入力パッド自動表示</span>
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="relative w-16 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-5 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex justify-between p-2 px-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base">入力パッド手動コピー</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base">結果登録</button>
        </div>
        <div className="flex justify-between p-2 px-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base">一括ページ展開</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
          onClick={() => setShowApiReg(true)} >
            APIキー登録
            </button>
        </div>
        <div className="flex justify-center p-2 px-6">
          <a href="https://autofill.robosell.jp/login" target="_blank">
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-4 text-base">ログイン画面</button>
          </a>
          <a href="https://robosell.jp/usefulcontent/" target="_blank">
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-4 text-base">お知らせ</button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
