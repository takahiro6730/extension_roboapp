import React, { useState } from "react";

function MultiUrl({ onBack }) {
    const [textareaValue, setTextareaValue] = useState("");

    const handleOpenClick = () => {
        const urls = textareaValue.split("\n").filter(Boolean);
        
        urls.forEach((url) => {
            const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
            window.open(formattedUrl, "_blank");
        });
    };

    const handleTextareaChange = (e) => {
        setTextareaValue(e.target.value);
    };

    return (
        <div className="font-sans">
            <div className="w-[550px] text-2xl bg-black text-white text-center p-2">
                Robosell
            </div>
            <div className="flex items-center justify-center bg-amber-100 py-4 pt-12">
                <textarea
                    name="url_rows"
                    id="url_rows"
                    cols={60}
                    rows={20}
                    value={textareaValue}
                    onChange={handleTextareaChange}
                ></textarea>
            </div>
            <div className="flex items-center justify-center bg-amber-100 pt-2 pb-6 w-full">
                <button
                    className="py-2 px-6 mx-4 rounded-lg text-sm font-medium text-white bg-teal-600"
                    onClick={handleOpenClick}
                >
                    開く
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

export default MultiUrl;

