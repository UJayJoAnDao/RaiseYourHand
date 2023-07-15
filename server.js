let express = require('express');
let app = express();
let port  = 3000;
let server = app.listen(port, () => {
    console.log(`listening on *:${port}`);
});

app.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>");
});