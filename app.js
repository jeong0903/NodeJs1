var express = require('express');
var app = express();
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views')
app.use(express.static('public'));
app.get('/template', function (req, res) {
    res.render('temp', {time:Date()});
})
app.get('/',  function (req, res) {
    res.send('Hello Home Page🏡')
});
app.get('/dynamic',  function (req, res) {
    var lis = '';
    for (var i = 0; i < 5; i++) {
        lis = lis + '<li>coding</li>';
    }
    var time = Date();
    var output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        Hello Dynamic
        <ul>
            ${lis}
        </ul>
        ${time}
    </body>
    </html>`
    res.send(output);
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