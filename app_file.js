var express = require('express');
var app = express();
app.locals.pretty = true;
app.set('views', './views_file');
app.set('view engine', 'pug');
app.get('/topic/new', function (req, res) {
    res.render('new')
})
app.post('/topic', function (req, res) {
    res.send('Hi, post')
})
app.listen(3000, function () {
    console.log('Conneted, 3000 port!');
})