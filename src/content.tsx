import "./content.css";
import { useEffect, useState } from "react";
let multi_result_modal_flag = false;
const handleAutofill = (message: any) => {
  if (message.action === "AUTOFILL") {
    const formData = message.data;
    const fields = document.querySelectorAll("input, textarea");
    fields.forEach((field: any) => {
      const fieldName = field.getAttribute("name");
      if (formData[fieldName]) {
        field.value = formData[fieldName];
      }
    });
  }
};

const openResultModal = (data: any) => {
  const closeResultModal = () => {
    const modal = document.querySelector('.mxResultModal');
    if (modal) modal.remove();
  };

  data.custom_no = data.custom_no || '-';
  data.customer_id = data.customer_id || '-';
  data.company_name = data.company_name || '-';

  const createResultModal = () => {
    const mResultModal = document.createElement('div');
    mResultModal.classList.add('mxResultModal');
    mResultModal.id = "RmxResultModal";

    const mResultContent = document.createElement('div');
    mResultContent.classList.add('ResultModal-content');
    mResultContent.setAttribute('id', 'mResultContentDiv');

    const resultBtnContainer = document.createElement('div');
    resultBtnContainer.classList.add('result-container');

    let infoTableHtml = '';
    if (data.custom_no === '-') {
      infoTableHtml = `
        <thead><tr><th>NO</th><th>顧客ID</th><th>企業名</th></tr></thead>
        <tbody>
          <tr><td colspan="2"><input type="text" id="ref_client_id_2"></td><td><button id="ref_client_btn_2">取得</button></td></tr>
        </tbody>`;
    } else {
      infoTableHtml = `
        <thead><tr><th>NO</th><th>顧客ID</th><th>企業名</th></tr></thead>
        <tbody>
          <tr><td>${data.custom_no}</td><td id="customer_id_td">${data.customer_id}</td><td>${data.company_name}</td></tr>
        </tbody>`;
    }

    const resultOptionsHtml = `
      <option value="0">送信成功</option>
      <option value="1">営業拒否</option>
      <option value="2">文字数超え</option>
      <option value="3">フォームなし</option>
      <option value="4">送信エラー</option>
      <option value="5">その他NG</option>`;

    const infoResultModal = document.createElement('table');
    infoResultModal.classList.add('ResultInfo');
    infoResultModal.setAttribute('id', 'mResultInfo');
    infoResultModal.innerHTML = infoTableHtml;

    resultBtnContainer.appendChild(infoResultModal);

    const resultXR = document.createElement('select');
    resultXR.classList.add('RXResult');
    resultXR.setAttribute('id', 'mRXResult');
    resultXR.innerHTML = resultOptionsHtml;

    const resultXRbtn = document.createElement('button');
    resultXRbtn.classList.add('XRresultSendBtn');
    resultXRbtn.setAttribute('id', 'mMFSendResultBtn');
    resultXRbtn.disabled = data.custom_no === '-' || data.custom_no == null;
    resultXRbtn.innerHTML = '結果登録';

    const mForm_CONTENT = '';
    resultBtnContainer.appendChild(resultXR);
    resultBtnContainer.appendChild(resultXRbtn);

    const closeContainer = document.createElement('div');
    closeContainer.classList.add('close-container');

    const closeTab = document.createElement('button');
    closeTab.classList.add('RXcloseTag');
    closeTab.setAttribute('id', 'mRXclose');
    closeTab.innerHTML = 'タブを閉じる';
    closeTab.onclick = closeResultModal;

    const crossMFModal = document.createElement('span');
    crossMFModal.classList.add('RXclose');
    crossMFModal.setAttribute('id', 'mRXclose');
    crossMFModal.innerHTML = '&times;';
    crossMFModal.onclick = closeResultModal;

    closeContainer.appendChild(closeTab);
    closeContainer.appendChild(crossMFModal);

    resultBtnContainer.appendChild(closeContainer);
    mResultContent.appendChild(resultBtnContainer);
    mResultModal.appendChild(mResultContent);

    document.body.appendChild(mResultModal);
    document.getElementById('RmxResultModal').style.display = 'block'
  };

  if (multi_result_modal_flag) closeResultModal();
  createResultModal();
  multi_result_modal_flag = true;

  document.querySelectorAll('.mformClip, .content-textarea').forEach((element) => {
    element.addEventListener('click', () => {
      let value = (element as HTMLElement).innerText || (element as HTMLInputElement).value;
      navigator.clipboard.writeText(value).catch((err) => {
        console.error('Failed to copy: ', err);
      });
      closeResultModal();
    });
  });

  document.getElementById('ref_client_btn_2')?.addEventListener('click', async () => {
    const sel_id = (document.getElementById('ref_client_id_2') as HTMLInputElement).value;
    try {
      const host_url = "https://autofill.robosell.jp/";
      const mForm_CURRENT_DOMAIN = window.location.hostname;
      let user_api_key = localStorage.getItem("user_api_key");
      console.log(localStorage.getItem("user_api_key"));
      try {
        const response = await fetch(`${host_url}api/get_text_data?api_key=${user_api_key}&domain=${mForm_CURRENT_DOMAIN}&sel_id=${sel_id}`);
        const result = await response.json();
      
        if (result.type !== 'GetSuccess') {
          alert(result.message);
          return;
        }
        document.querySelector('.content-textarea')!.textContent = result.message;
      } catch (error) {
        console.error("Error fetching data: ", error);
      }

      
    } catch (error) {
      alert('Error occurred');
    }
  });

  document.getElementById('mMFSendResultBtn')?.addEventListener('click', async () => {
    console.log('mMFSendResultBtn----start');
    const option_id = (document.getElementById('mRXResult') as HTMLSelectElement).value;
    const customer_id = document.getElementById('customer_id_td')?.textContent || '';
    try {
      const host_url = "https://autofill.robosell.jp/";
      const mForm_CURRENT_DOMAIN = window.location.hostname;
      const mForm_CURRENT_URL = window.location.href;
      const mForm_CONTENT = document.getElementById('mformMFDiv');
      let user_api_key = localStorage.getItem("user_api_key");
      const response = await fetch(`${host_url}api/send_result_site?api_key=${user_api_key}&domain=${mForm_CURRENT_DOMAIN}&option_id=${option_id}&contact_url=${mForm_CURRENT_URL}&content=${mForm_CONTENT}&customer_id=${customer_id}`);
      const result = await response.json();

      if (result.type !== 'OperationSuccess') {
        alert(result.message);
        return;
      }

      alert(result.message);
    } catch (error) {
      alert('Error occurred');
    }
  });
};

const createElementDiv = (leftLabel, mForm_data, rightLabels, buttonClass) => {
  const newMFDiv = document.createElement("div");
  newMFDiv.className = "row-item-div";

  const newMFDivLeft = document.createElement("div");
  newMFDivLeft.className = "row-item-div-left";
  newMFDivLeft.textContent = leftLabel;

  const newMFDivRight = document.createElement("div");
  newMFDivRight.className = "row-item-div-right";

  if (leftLabel === "本文") {
    const contentTextarea = document.createElement("div");
    contentTextarea.className = "content-textarea";
    contentTextarea.textContent = mForm_data["content"] || "";

    const mForm_button = document.createElement("input");
    mForm_button.type = "hidden";
    mForm_button.className = "textarea-value";
    mForm_button.value = mForm_data["content"] || "";

    newMFDivRight.append(contentTextarea, mForm_button);
  } else {
    rightLabels.forEach((label) => {
      const mForm_button = document.createElement("input");
      mForm_button.type = "button";
      mForm_button.className = buttonClass;
      mForm_button.value = mForm_data[label] || "";
      newMFDivRight.appendChild(mForm_button);
    });
  }

  newMFDiv.append(newMFDivLeft, newMFDivRight);
  return newMFDiv;
};

const createModal = (contentDivs, infoTableHtml, resultOptionsHtml, closeAction) => {
  const mMFModal = document.createElement("div");
  mMFModal.className = "MFModal";
  mMFModal.id = "MFModal";

  const mForm_content = document.createElement("div");
  mForm_content.className = "MFModal-content";
  mForm_content.id = "mformMFDiv";

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  const closeContainer = document.createElement("div");
  closeContainer.className = "close-container";

  const crossMFModal = document.createElement("span");
  crossMFModal.className = "MFclose";
  crossMFModal.id = "mMFclose";
  crossMFModal.innerHTML = "&times;";
  console.log("createModal----", closeAction);
  crossMFModal.onclick = closeAction;

  closeContainer.appendChild(crossMFModal);
  buttonContainer.appendChild(closeContainer);
  mForm_content.appendChild(buttonContainer);

  contentDivs.forEach((div) => mForm_content.appendChild(div));
  mMFModal.appendChild(mForm_content);

  document.body.appendChild(mMFModal);
};

const displayModal = async (data, closeAction) => {
  const mForm_data = data
  const contentDivs = [
    createElementDiv("名前", mForm_data, ["full_name", "last_name", "first_name", "full_hira", "last_hira", "first_hira"], "mformButton"),
    createElementDiv("会社名", mForm_data, ["company", "company_hira"], "mformButton"),
    createElementDiv("住所", mForm_data, ["post", "post1", "post2", "address", "city", "street", "building"], "mformButton"),
    createElementDiv("メール", mForm_data, ["email"], "mformButton"),
    createElementDiv("電話番号", mForm_data, ["tel", "tel1", "tel2", "tel3"], "mformButton"),
    createElementDiv("業種・業界", mForm_data, ["business"], "mformButton"),
    createElementDiv("部署名・役職名", mForm_data, ["department", "job"], "mformButton"),
    createElementDiv("本文", mForm_data, ["content"], "mformButton"),
  ];
  console.log("displayModal----", closeAction);
  createModal(contentDivs, "", "", closeAction);

  const buttons = document.querySelectorAll('.mformButton');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const textToCopy = button.innerText || button.value;
      navigator.clipboard.writeText(textToCopy)
      closeAction()
      document.body.focus();
    });
  });
};

const ContentScript = () => {
  const [showModalFlag, setShowModalFlag] = useState(false);

  const displayFlagModal = () => {
    const MFModal = document.getElementById('MFModal');
    if (MFModal) {
      MFModal.style.display = 'block';
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "AUTOFILL") {
        handleAutofill(message);
      }
      if (message.action === "MANUAL_COPY") {
        displayModal(message.data, () => {
          const modals = document.querySelectorAll('#MFModal');
          const lastModal = modals[modals.length - 1];
          lastModal.remove()
        });
        const modals = document.querySelectorAll('#MFModal');
        const lastModal = modals[modals.length - 1];
        lastModal.style.display = 'block';
      }
      if (message.action === "REGISTER_RESULT") {
        openResultModal(message.data);
        localStorage.setItem("user_api_key", message.user_api_key);
      }
      if (message.action === "FLAG_PANEL") {
        console.log(message.sendFlag)
        if (message.sendFlag) {
          displayModal(message.data, () => {
            const modals = document.querySelectorAll('#MFModal');
            const firstModal = modals[0];
            firstModal.style.display = 'none';
          });
          setShowModalFlag(message.sendFlag);
        }
        else {
          const modals = document.querySelectorAll('#MFModal');
          if(modals){
            const firstModal = modals[0];
            firstModal.remove();
          }
          setShowModalFlag(message.sendFlag);
        }
      }
      sendResponse({ status: "Form data filled!" });
    });
  }, []);

  useEffect(() => {
    const inputElements = document.querySelectorAll('input, textarea');
    if (showModalFlag) {
      inputElements.forEach((element) => {
        element.addEventListener('dblclick', displayFlagModal);
      });
    }
  }, [showModalFlag]);

  return null;
};

export default ContentScript;