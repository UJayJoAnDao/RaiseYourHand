let express = require('express');
let app = express();
let port  = 3000;
let server = app.listen(port, () => {
    console.log(`listening on *:${port}`);
});

app.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>");
});
app.get('/student', (req, res) => {
    res.sendFile(__dirname + '/views/student-login.html');
});
app.get('/student/:roomID', (req, res) => {
    res.sendFile(__dirname + '/views/student-classroom.html');
});
app.get('/TEACHer', (req, res) => {
    res.sendFile(__dirname + '/views/teacher-login.html');
});
app.get('/TEACHer/:roomID', (req, res) => {
    res.sendFile(__dirname + '/views/teacher-classroom.html');
});