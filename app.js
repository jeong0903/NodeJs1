var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './views')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}))
app.get('/form', function (req, res) {
    res.render('form');
})
app.get('/form_receiver', function (req, res) {
    var title = req.query.title;
    var description = req.query.description;
    res.send(title+', '+description);
})
app.post('/form_receiver', function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    res.send(`${title}, ${description}`);
})
app.get('/topic/:id', function (req, res) {
    var topics = [
        'Javascript is ...', 
        'Node is ...',
        'Express is ...'
    ];
    var output = `
        <a href ="/topic/0">Javascript</a><br>
        <a href ="/topic/1">Node</a><br>
        <a href ="/topic/2">Express</a><br><br>
        ${topics[req.params.id]}
    `;
    res.send(output);
})
app.get('/topic/:id/:mode', function (req, res) {
    res.send(req.params.id + ',' + req.params.mode)
})
app.get('/param/:module_id/:topic_id', function (req, res) {
    res.json(req.params);
})
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