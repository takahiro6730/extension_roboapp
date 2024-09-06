import React, { useEffect, useState } from "react";

function ApiReg({ onBack }) {
  const [apiKey, setApiKey] = useState("");

  const handleRegKeyClick = () => {
    if (apiKey) {
      localStorage.setItem("user_api_key", apiKey);
      alert("API_KEYがアーカイブされました。");
    } else {
      alert("API_KEYを入力してください。");
    }
  };

  useEffect(() => {
    const storedApiKey = localStorage.getItem("user_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  return (
    <div className="font-sans">
      <div className="w-[350px] text-2xl bg-black text-white text-center p-2">
        Robosell
      </div>
      <div className="flex items-center bg-amber-100 py-4">
        <div className="w-1/4">
          <label className="block text-gray-500 font-bold text-right mb-1 mb-0 pr-4">
            KEY
          </label>
        </div>
        <div className="w-2/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="api_key"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API_KEY"
          />
        </div>
      </div>
      <div className="flex items-center justify-center bg-amber-100 pt-2 pb-6 w-full">
        <button
          className="py-2 px-6 mx-4 rounded-lg text-sm font-medium text-white bg-teal-600"
          onClick={handleRegKeyClick}
        >
          保存
        </button>
        <button
          className="py-2 px-6 mx-4 rounded-lg text-sm font-medium bg-teal-200 text-teal-800"
          onClick={onBack}
        >
          戻る
        </button>
      </div>
    </div>
  );
}

export default ApiReg;
