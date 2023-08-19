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
        key 為分配給各教室的 ID（下方以 classroomID 表示），型態為 string； 
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
    // 假資料
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
            "isInClassroom": true,
            "queueNo": 0,
            "done": false,
        },
        {
            "socketID": "ffba37e23422",
            "name": "王小綠",
            "isInClassroom": true,
            "queueNo": 1,
            "done": true,
        },
    ],
}


/* Communicate with student-login.html */
function verifyClassroomID() { }

/* Communicate with teacher-login.html */
function createClassroom() { }

function createRandomClassroomID() { }

function getAvailableClassroom() { }


app.get('/student', (req, res) => {
    res.sendFile(__dirname + '/views/student-login.html');
});

app.get('/TEACHer', (req, res) => {
    res.sendFile(__dirname + '/views/teacher-login.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('connected', { id: socket.id, message: 'connected' });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});