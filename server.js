const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3000;


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