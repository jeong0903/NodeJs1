var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "asfd1234!@#$",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/count", function (req, res) {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send("count : " + req.session.count);
});

app.get("/auth/login", function (req, res) {
  var output = `
  <h1>LOG IN</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="user name">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});

app.get("/welcome", function (req, res) {
  if(req.session.displayName){
    res.send(`
    <h1>hello, ${req.session.displayName} !</h1>
    <a hef="/auth/logout">Log out</a>
    `)
  } else{
    res.send(`
    <h1>Welcome</h1>
    <a href="/auth/login">Login</a>
    `)
  }
});

app.post("/auth/login", function (req, res) {
  var user = {
    username: "jane",
    password: "1234",
    displayName: "Jane",
  };
  var uname = req.body.username;
  var pwd = req.body.password;

  if (uname === user.username && pwd === user.password) {
    req.session.displayName = user.displayName;
    res.redirect("/welcome");
  } else {
    res.send('Who are you? <a href ="/auth/login">back</a>');
  }
});
app.listen(3000, function () {
  console.log("Connected 3000 port is running!");
});
