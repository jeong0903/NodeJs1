var express = require("express");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "asfd1234!@#$",
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "admin1234",
      database: "o2",
      clearExpired: true, // 만료된 세션 자동 삭제
      checkExpirationInterval: 900000, // 세션 만료 확인 간격 (15분)
      expiration: 86400000, // 세션 만료 시간 (24시간)
    }),
  })
);

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

app.get("/auth/logout", function (req, res) {
  delete req.session.displayName;
  req.session.save(function () {
    res.redirect('/welcome');
  })
});

app.get("/welcome", function (req, res) {
  if (req.session.displayName) {
    res.send(`
    <h1>hello, ${req.session.displayName} !</h1>
    <a href="/auth/logout">Log out</a>
    `);
  } else {
    res.send(`
    <h1>Welcome</h1>
    <a href="/auth/login">Login</a>
    `);
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
    req.session.save(function () {
      res.redirect("/welcome");
    })
  } else {
    res.send('Who are you? <a href ="/auth/login">back</a>');
  }
});
app.listen(3000, function () {
  console.log("Connected 3000 port is running!");
});
