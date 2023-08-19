const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3000;

/* 
    classroomInfo 物件用來記錄目前教室所有資訊，
    其中 
        key 為分配給各教室的 ID（下方以 classroomID 表示），型態為 string，內含 6 個數字長度； 
        value 為一個陣列，陣列中每個元素為一個物件，每個物件記錄一個學生的資訊，資訊格式如下：

    classroomID: [
        {
            "socketID": 目前連線的 socketID（string, ex: "212937a9f422"）,
            "name": 學生姓名（string, ex: "張中大"）,
            "isInClassroom": 是否在教室中（boolean, ex: true）,
            "queueNo": 排隊號碼，-1 表示未在隊列中（int, ex: -1、1）,
            "done": 是否已完成（boolean, ex: false）,
        }, ...
    ]
*/
const classroomInfo = {
    // 假資料 1
    "356157": [
        {
            "socketID": null,
            "name": "王大小",
            "isInClassroom": false,
            "queueNo": -1,
            "done": false,
        },
        {
            "socketID": "212937a9f422",
            "name": "張中大",
            "isInClassroom": true,
            "queueNo": -1,
            "done": false,
        },
        {
            "socketID": "21ba37e23422",
            "name": "李小中",
            "isInClassroom": false,
            "queueNo": 0,
            "done": false,
        },
        {
            "socketID": "ffba37e23422",
            "name": "王小綠",
            "isInClassroom": true,
            "queueNo": 2,
            "done": false,
        },
        {
            "socketID": "efbab4e39022",
            "name": "余大高",
            "isInClassroom": false,
            "queueNo": 1,
            "done": true,
        },
    ],
    // 假資料 2
    "144289": [
        {
            "socketID": "212937a9f422",
            "name": "金雖小",
            "isInClassroom": false,
            "queueNo": -1,
            "done": false,
        },
        {
            "socketID": null,
            "name": "盧小小",
            "isInClassroom": false,
            "queueNo": -1,
            "done": false,
        },
        {
            "socketID": "21ba37e23422",
            "name": "伍告雖",
            "isInClassroom": false,
            "queueNo": -1,
            "done": false,
        },
        {
            "socketID": "ffba37e23422",
            "name": "發大財",
            "isInClassroom": true,
            "queueNo": 1,
            "done": false,
        },
    ],
}


/* Communicate with student-login.html */
function verifyClassroomID(classroomID) {
    if (classroomInfo[classroomID] === undefined) {
        // 若 classroomID 不存在，則回傳錯誤訊息，表示無此教室
        return "fail";
    }
    return "success";
}

/* Communicate with teacher-login.html */
function createClassroom(classroomID, studentNames) {
    // 於 classroomInfo 中新增一個教室，並初始化學生資訊
    let studentInfo = [];
    for (let i = 0; i < studentNames.length; i++) {
        studentInfo.push({
            "socketID": null,
            "name": studentNames[i],
            "isInClassroom": false,
            "queueNo": -1,
            "done": false,
        });
    }

    // 將 classroomID 與學生資訊陣列加入 classroomInfo 中
    classroomInfo[classroomID] = studentInfo;

    return classroomID;
}

function createRandomClassroomID() {
    // 產生 6 個數字的隨機數字並回傳
    let rand6Num = Math.floor(Math.random() * 1000000)
        .toString().padStart(6, '0');
    while (classroomInfo[rand6Num] !== undefined) {
        // 若 classroomInfo 中已存在此 classroomID，則重新產生
        rand6Num = Math.floor(Math.random() * 1000000)
            .toString().padStart(6, '0');
    }
    return rand6Num;
}

function getAvailableClassroom() {
    // 整理出目前在 classroomInfo 中 所有可用教室的 ID
    return Object.keys(classroomInfo);
}

/* 設定登入頁面路由 */
app.get('/student', (req, res) => {
    res.sendFile(__dirname + '/views/student-login.html');
});

app.get('/TEACHer', (req, res) => {
    res.sendFile(__dirname + '/views/teacher-login.html');
});

/* 設定 socket.io 相關監聽事件 */
io.on('connection', (socket) => {
    // 若某 socket 連線，則印出訊息，並回傳該 socket 的 ID 與對應訊息
    console.log('a user connected');
    io.emit('connected', { id: socket.id, message: 'connected' });

    // 處理 verify-classroom-id 事件
    socket.on('verify-classroom-id', (classroomID) => {
        // 預設回傳的物件，預期為失敗訊息
        let resultObj = { id: socket.id, studentNames: [], message: 'fail' };

        let verifiedResult = verifyClassroomID(classroomID);
        if (verifiedResult === "success") {
            // 若 classroomID 存在，則整理出該教室的學生名單
            resultObj.studentNames = classroomInfo[classroomID]
                .filter((student) => !student.isInClassroom)
                .map((student) => student.name);
            resultObj.message = verifiedResult;
        }

        // 回傳訊息
        io.emit('verify-classroom-id', resultObj);
    });

    // 處理 create-random-classroom-id 事件
    socket.on('create-random-classroom-id', () => {
        // 預設回傳的物件
        let resultObj = { id: socket.id, randomClassroomID: createRandomClassroomID() };
        // 回傳訊息
        io.emit('create-random-classroom-id', resultObj);
    });

    // 處理 get-available-classroom 事件
    socket.on('get-available-classroom', () => {
        // 預設回傳的物件
        let resultObj = { id: socket.id, classroomIDs: getAvailableClassroom() };
        // 回傳訊息
        io.emit('get-available-classroom', resultObj);
    });

    // 處理 create-classroom 事件
    socket.on('create-classroom', (obj) => {
        // 預設回傳的物件
        let resultObj = {
            id: socket.id,
            classroomID: createClassroom(obj.classroomID, obj.studentNames)
        };
        // 回傳訊息
        io.emit('create-classroom', resultObj);
    });
});

/* 啟動 server */
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});