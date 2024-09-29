const host_url = process.env.PLASMO_HOST_URL;

import { useState, useEffect } from "react";
import axios from 'axios';

function Popup() {
  const [apiKey, setApiKey] = useState("");
  const [domain, setDomain] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleAutoInputClick = async () => {
    await getUserData();

    chrome.storage.local.get(["MFORM_MODAL_DATA"], async function (data) {
      const scriptData = data.MFORM_MODAL_DATA;

      const inputSelectors = await fetch(chrome.runtime.getURL("inputSelectors.json")).then(res => res.json());

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabId = tabs[0].id;

        // Execute the content script to auto-fill inputs
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: (scriptData, inputSelectors) => {
            inputSelectors.inputs.forEach(({ selector, key }) => {
              const input = document.querySelector(selector);
              if (input && scriptData[key]) {
                input.value = scriptData[key];
              }
            });
          },
          args: [scriptData, inputSelectors]
        });
      });
    });
  };

  // Function to handle checkbox input
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    chrome.storage.local.set({ MFORM_MODAL_FLAG: e.target.checked });
  };

  // Function to fetch user data
  const getUserData = async () => {
    try {
      const response = await axios.get(`${host_url}api/get_extension_data`, {
        params: {
          api_key: apiKey,
          domain: domain,
        },
      });
  
      const scriptData = JSON.parse(response.data.user_data);
      await chrome.storage.local.set({ MFORM_MODAL_DATA: scriptData });
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  // Render the UI for the popup
  return (
    <div>
      <button id="autoInput" onClick={handleAutoInputClick}>
        Auto Input
      </button>
      <label>
        Enable flag:
        <input
          id="sub_input"
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </label>
    </div>
  );
}

export default Popup;