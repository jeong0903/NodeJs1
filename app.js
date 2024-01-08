var express = require('express');
var app = express();
app.use(express.static('public'));
app.get('/',  function (req, res) {
    res.send('Hello Home Page🏡')
});
app.get('/route',  function (req, res) {
    res.send('Hello Kermit the Frog <img src = "/Kermit.jpeg">')
});

app.get('/login', function (req, res) {
    res.send('Login Plz🙏')
});
app.listen(3000, function () {
    console.log('Connected 3000 port!');
});