document.addEventListener('DOMContentLoaded', () => {
    // 取得 DOM 元素
    const landingSection = document.getElementById('landing-section');
    const sentSection = document.getElementById('sent-section');
    const successPopup = document.getElementById('success-popup');
    
    const inputNickname = document.getElementById('input-nickname');
    const inputStory = document.getElementById('input-story');
    const displayNickname = document.getElementById('display-nickname');
    
    const btnSubmit = document.getElementById('btn-submit');
    const btnRestart = document.getElementById('btn-restart');
    
    const errorNickname = document.getElementById('error-nickname');
    const errorStory = document.getElementById('error-story');
    const currentCountSpan = document.getElementById('current-count');

    // 設定字數監聽
    inputStory.addEventListener('input', function() {
        const currentLength = this.value.length;
        currentCountSpan.textContent = currentLength;
        
        // 輸入時移除錯誤提示
        if(currentLength > 0) {
            inputStory.parentElement.classList.remove('error');
        }
    });

    inputNickname.addEventListener('input', function() {
        if(this.value.trim().length > 0) {
            inputNickname.parentElement.classList.remove('error');
        }
    });

    // 1. 送出回應邏輯
    btnSubmit.addEventListener('click', () => {
        const nickname = inputNickname.value.trim();
        const story = inputStory.value.trim();
        let isValid = true;

        // 驗證：檢查暱稱
        if (!nickname) {
            inputNickname.parentElement.classList.add('error');
            isValid = false;
        } else {
            inputNickname.parentElement.classList.remove('error');
        }

        // 驗證：檢查故事
        if (!story) {
            inputStory.parentElement.classList.add('error');
            isValid = false;
        } else {
            inputStory.parentElement.classList.remove('error');
        }

        // 如果驗證未通過，停止執行
        if (!isValid) return; 

        // --- API 傳送開始 ---
        
        // 1. 鎖定按鈕，避免重複點擊
        btnSubmit.disabled = true;
        btnSubmit.innerText = "傳送中..."; 

        // 2. 發送資料到後端 (修改處：填入正確的 Zeabur API 網址)
        // 注意：這裡必須包含 /api/responses
        const apiUrl = 'https://storynest115.zeabur.app'; 
      
        fetch(apiUrl, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickname: nickname,
                story: story
            })
        })
        .then(response => {
            if (response.ok) {
                // 3. 成功：顯示成功動畫
                return response.json().then(() => {
                    showSuccessPopup();
                });
            } else {
                // 失敗：拋出錯誤讓 catch 捕捉
                // 這裡可以把後端回傳的錯誤訊息印出來幫助除錯
                return response.json().then(err => {
                    throw new Error(err.message || '伺服器回應錯誤');
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // 友善的錯誤提示
            alert("傳送失敗！請確認你的後端程式碼是否已包含 /api/responses 路由，或檢查網路連線。");
        })
        .finally(() => {
            // 4. 無論成功或失敗，都恢復按鈕狀態
            btnSubmit.disabled = false;
            btnSubmit.innerText = "送出回應";
        });
    });

    // 2. 顯示成功彈窗並跳轉
    function showSuccessPopup() {
        successPopup.classList.remove('hidden');

        // 等待 1000ms (1秒) 後跳轉
        setTimeout(() => {
            successPopup.classList.add('hidden');
            goToPostSentPage();
        }, 1000);
    }

    // 3. 切換到「已送出」頁面
    function goToPostSentPage() {
        // 將暱稱填入顯示區塊
        displayNickname.textContent = inputNickname.value;

        // 切換區塊顯示
        landingSection.classList.remove('active');
        landingSection.classList.add('hidden');
        
        sentSection.classList.remove('hidden');
        sentSection.classList.add('active');
        
        // 滾動到頂部
        window.scrollTo(0, 0);
    }

    // 4. 「再寫一個故事」邏輯
    btnRestart.addEventListener('click', () => {
        // 清空表單
        inputNickname.value = '';
        inputStory.value = '';
        currentCountSpan.textContent = '0';
        
        // 移除所有錯誤狀態
        inputNickname.parentElement.classList.remove('error');
        inputStory.parentElement.classList.remove('error');

        // 切換回 Landing Page
        sentSection.classList.remove('active');
        sentSection.classList.add('hidden');
        
        landingSection.classList.remove('hidden');
        landingSection.classList.add('active');
        
        // 滾動到頂部
        window.scrollTo(0, 0);
    });
});