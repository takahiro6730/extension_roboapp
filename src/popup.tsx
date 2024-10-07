import { useState, useEffect } from "react"
import axios from 'axios';

import "./style.css"
import ApiReg from "./apiReg"
import MultiUrl from "./multiPages"


function IndexPopup() {
  const [showApiReg, setShowApiReg] = useState(false);
  const [showMultiurl, setShowMultiUrl] = useState(false);
  const [isPanelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    const checkboxState = localStorage.getItem("checkboxState");
    console.log("start0----getItem------", checkboxState);
    setPanelVisible(checkboxState === "true");
  }, []);

  useEffect(() => {
    console.log("start1---isPanelVisible after update----", isPanelVisible);
  }, [isPanelVisible]);

  const handleShowPanel = async (event: any) => {
    const checked = event.target.checked;
    localStorage.setItem("checkboxState", checked.toString());
    setPanelVisible(checked);
    const sendData = await getUserData();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "FLAG_PANEL", data: sendData, sendFlag: checked }, (response) => {
          console.log(response)
        })
      }
    })
  };

  const getCurrentDomain = async () => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          const url = new URL(tabs[0].url);
          resolve(url.hostname);
        }
      });
    });
  };

  const host_url = "https://autofill.robosell.jp/";
  const getUserData = async () => {
    let apiKey = localStorage.getItem("user_api_key");
    let domain = await getCurrentDomain();

    const response = await axios.get(`${host_url}api/get_extension_data`, {
      params: {
        api_key: apiKey,
        domain: domain,
      }
    });
    console.log(response);
    const scriptData = JSON.parse(response.data.user_data);
    localStorage.setItem("MFORM_MODAL_DATA", scriptData);
    return scriptData;
  };

  const handleAutoFillClick = async () => {
    const sendData = await getUserData();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "AUTOFILL", data: sendData }, (response) => {
          console.log(response)
        })
      }
    })
  }

  const handleManualCopy = async () => {
    const sendData = await getUserData();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "MANUAL_COPY", data: sendData }, (response) => {
          console.log(response)
        })
      }
    })
  }

  const handleRegisterResult = async () => {
    const sendData = await getUserData();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "REGISTER_RESULT", data: sendData, user_api_key: localStorage.getItem("user_api_key") }, (response) => {
          console.log(response)
        })
      }
    })
  }

  if (showApiReg) {
    return <ApiReg onBack={() => setShowApiReg(false)} />;
  } else if (showMultiurl) {
    return <MultiUrl onBack={() => setShowMultiUrl(false)} />;
  }

  return (
    <div className="font-sans">
      <div className="w-[350px] text-2xl bg-black text-white text-center p-2">
        Robosell
      </div>
      <div className="bg-amber-100 py-4">
        <div className="flex justify-center p-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={handleAutoFillClick}
          >
            自動入力
          </button>
        </div>
        <div className="flex justify-center p-2">
          <label className="w-full flex items-center cursor-pointer justify-center">
            <span className="ms-3 text-lg text-gray-900 font-bold mr-4"
            >
              入力パッド自動表示
            </span>
            <input type="checkbox" className="sr-only peer" id="enableShowPannel"
              onChange={handleShowPanel}
              checked={isPanelVisible}
            />
            <div className="relative w-16 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-5 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex justify-between p-2 px-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={handleManualCopy}>
            入力パッド手動コピー</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={handleRegisterResult}>
            結果登録
          </button>
        </div>
        <div className="flex justify-between p-2 px-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={() => setShowMultiUrl(true)} >
            一括ページ展開
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            onClick={() => setShowApiReg(true)} >
            APIキー登録
          </button>
        </div>
        <div className="flex justify-center p-2 px-6">
          <a href="https://autofill.robosell.jp/login" target="_blank">
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-4 text-base">ログイン画面</button>
          </a>
          <a href="https://autofill.robosell.jp/usefulcontent/" target="_blank">
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-4 text-base">お知らせ</button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
