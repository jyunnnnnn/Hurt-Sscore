$(document).ready(function() {
    // 頁面加載後顯示 index_page 頁面
    showPage('#index_page');
    // 點擊 "建立新檔" 按鈕
    $('#Create').click(function() {
        showPage('#start_page');
    });

    // 點擊 "查看紀錄" 按鈕
    $('#Record_List').click(function () {
        displayRecords();
        showPage('#data_page');
    });

    $('#Load').click(function() {
        showPage('#load_page');
    });

    // 點擊 "返回" 按鈕（對於 index_page 和 data_page）
    $('#BackToIndex1, #BackToIndex2').click(function() {
        showPage('#index_page');
    });

    // 點擊 "開始" 按鈕
    $('#Start').click(function() {
        startRecording();
    });

    // 點擊 "返回" 按鈕（在 start_page 中）
    $('#Back').click(function() {
        showPage('#index_page');
    });

    // 設定按鈕的點擊事件
    $('#pain1').click(function() {
        setPainLevel(1);
    });
    $('#pain2').click(function() {
        setPainLevel(2);
    });
    $('#pain3').click(function() {
        setPainLevel(3);
    });
    $('#pain4').click(function() {
        setPainLevel(4);
    });
    $('#pain5').click(function() {
        setPainLevel(5);
    });
    let lastClickTime = 0;
    // 點擊 "返回" 按鈕（在 recording_page 中）
    $('#BackToIndex3').click(function() {
        // 顯示確認退出對話框
        const currentTime = new Date().getTime();
            if (currentTime - lastClickTime < 300) { // 300ms 內視為雙擊
                stopRecording();
                showPage('#index_page');
            }
            lastClickTime = currentTime;
    });
    

});

// 顯示指定頁面並隱藏其他頁面
function showPage(pageId) {
    $('.page').hide(); // 隱藏所有頁面
    $(pageId).show(); // 顯示指定頁面
}

// 本地變數

let nowNumber = "";
let nowTime_interval = "";
// 開始紀錄功能
function startRecording() {
    let records = JSON.parse(localStorage.getItem('Hurt_Score_records')) || {};
    const number = $('#Number').val();
    const timeInterval = $('#Time_Interval').val();
    if (number && timeInterval) {
        // 儲存設定到本地變數
        nowNumber=number;
        nowTime_interval=timeInterval;
        if (records[nowNumber]) {
            // 如果編號已存在，繼續沿用記錄
            console.log(`編號 ${nowNumber} 已存在，繼續沿用之前的紀錄。`);
            currentRecordList = records[nowNumber].recordList || [];
        } else {
            // 如果編號不存在，初始化新記錄
            console.log(`編號 ${nowNumber} 不存在，創建新的紀錄。`);
            currentRecordList = [];
        }
        console.log("編號:",nowNumber,"時間間隔:",nowTime_interval);
        // 跳轉到錄製頁面
        showPage('#recording_page');
        $('#recordingNumber').text(`編號: ${number}`);

        // 開始倒數計時
        startCountdown(timeInterval); // 傳遞使用者設定的時間間隔
    } else {
        alert("請輸入編號和時間間隔");
    }
}

let currentPainLevel = 'X';
// 設定疼痛等級
function setPainLevel(level) {
    // 儲存選擇的疼痛等級
    currentPainLevel = level;

    // 恢復所有按鈕顏色
    $('#pain1, #pain2, #pain3, #pain4, #pain5').css('background-color', '');

    // 設置當前按鈕顏色為紅色
    $(`#pain${level}`).css('background-color', 'red');
}

let countdownInterval; // 倒數計時器的ID
let flag=0;
// 開始倒數計時
function startCountdown(timeInterval) {
    let countdownTime = timeInterval;
    let countdownDisplay = $('#countdown');
    countdownDisplay.text(countdownTime);
    const alertSound = new Audio('alert_sound.mp3'); 
    // 每秒更新倒數計時
    countdownInterval = setInterval(function() {
        
        // 每次倒數完 X 秒後，記錄一次數據

        if (countdownTime == 0) {
            countdownTime = timeInterval; // 重設倒數
            alertSound.play();
            $('.alert_text').show();
            // 播放警示音 顯示警示文字
            setTimeout(function() {
                alertSound.pause();
                alertSound.currentTime = 0; // 重置到音效開始的地方
                $('.alert_text').hide();
            }, 500); // 500 毫秒
            
            if(flag){
                recordPainLevel(); // 記錄疼痛等級
            }
            flag=1;
            
            $('#pain1, #pain2, #pain3, #pain4, #pain5').css('background-color', ''); // 恢復按鈕顏色
            currentPainLevel = 'X';
            
        }
            countdownTime--;
            countdownDisplay.text(Number(countdownTime)+1);
    }, 1000);

}
let currentRecord = {};
let currentRecordList = [];


// 記錄疼痛等級的函數
function recordPainLevel() {
    // 記錄疼痛等級，如果沒選擇則為 "X"
    let painLevel = currentPainLevel;
    let timestamp = new Date().toLocaleString();
    console.log(`記錄時間：${timestamp}, 疼痛等級：${painLevel}`);
    nowTimeRecord = {
        time:timestamp,
        level:painLevel
    }
    // 儲存疼痛記錄
    currentRecordList.push(nowTimeRecord)
}

// 停止錄製並清除計時器
function stopRecording() {
    let records = JSON.parse(localStorage.getItem('Hurt_Score_records')) || {};
    console.log(currentRecordList)
    recordPainLevel(); // 記錄疼痛等級
    currentRecord = {
        recordNumber:nowNumber,
        recordList:currentRecordList
    }

     // 儲存至 records，以編號作為鍵
     records[nowNumber] = currentRecord;

     // 同步至 localStorage
     localStorage.setItem('Hurt_Score_records', JSON.stringify(records));


    clearInterval(countdownInterval); // 清除倒數計時器
    currentPainLevel = 'X'; // 重置疼痛值
    nowNumber = ""; // 重置編號
    nowTime_interval = ""; // 重置時間
    flag = 0; //重置FirstTime flag
    $('#pain1, #pain2, #pain3, #pain4, #pain5').css('background-color', ''); // 恢復按鈕顏色
    console.log(currentRecord)
}

function displayRecords() {
    let records = JSON.parse(localStorage.getItem('Hurt_Score_records')) || {};
    let container = $('#Insert_Here');
    container.empty(); // 清空現有內容

    if (Object.keys(records).length === 0) {
        container.append('<p>目前尚無紀錄</p>');
    } else {
        Object.keys(records).forEach(key => {
            let record = records[key];
            let recordHtml = `
                <div class="record">
                    <h3 class="record-title" data-record-id="${key}">紀錄 編號: ${record.recordNumber}
                        <button class="share-button" onclick="downloadRecords('${record.recordNumber}')">⬇️</button>
                        <button class="delete-button" onclick="deleteRecord('${record.recordNumber}')">❌</button>
                    </h3>
                    <div class="record-details" style="display: none;">
                        <ul>
                            ${record.recordList.map(entry => `
                                 <li><span>痛度: ${entry.level}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>${entry.time}</span></li>
                                `).join('')}
                        </ul>
                    </div>
                </div>
                <hr>`;
            container.append(recordHtml);
        });

        // 點擊編號顯示或隱藏詳細紀錄
        $('.record-title').on('click', function() {
            let recordId = $(this).data('record-id');
            let detailsDiv = $(this).next('.record-details');
            
            // 切換顯示隱藏
            detailsDiv.toggle();
        });
    }
}

function downloadRecords(number) {
    // 獲取記錄數據
    let records = JSON.parse(localStorage.getItem('Hurt_Score_records')) || {};
    let record = records[number];

    if (record) {
        let recordText = `紀錄編號: ${record.recordNumber}\n`;
        recordText += `時間\t\t痛度\n`;
        
        record.recordList.forEach(entry => {
            recordText += `${entry.time}\t\t${entry.level}\n`;
        });

        let blob = new Blob([`\uFEFF${recordText}`], { type: 'text/plain;charset=utf-8' });
        
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `紀錄編號_${record.recordNumber}.txt`;

        link.click();
    } else {
        alert("該紀錄未找到！");
    }
}
function deleteRecord(number) {
    let records = JSON.parse(localStorage.getItem('Hurt_Score_records')) || {};
    let record = records[number];

    if (record) {
        if (confirm("確定要刪除此紀錄嗎？")) {
            delete records[number];
            localStorage.setItem('Hurt_Score_records', JSON.stringify(records));
            alert("紀錄已刪除！");
              // 清空相關變數
            if (nowNumber === number) {
                currentRecordList = [];
                nowNumber = "";
                nowTime_interval = "";
                currentPainLevel = 'X';
                console.log("內存已清空。");
            }
            displayRecords(); // Refresh the display after deletion
        }
    } else {
        alert("該紀錄未找到！");
    }
}
console.log("OK")