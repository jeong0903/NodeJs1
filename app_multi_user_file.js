var express = require("express");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var md5 = require("md5");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "asfd1234!@#$",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
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

app.get("/auth/logout", function (req, res) {
  delete req.session.displayName;
  res.redirect("/welcome");
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
  var uname = req.body.username;
  var pwd = req.body.password;
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    if (uname === user.username && md5(pwd) === user.password) {
      req.session.displayName = user.displayName;
      return req.session.save(function () {
        res.redirect("/welcome");
      });
    }
  }
  res.send('who are you? <a href ="/auth/login">log in</a>')
});

var users = [
  {
    username: "jane",
    password: "81dc9bdb52d04dc20036dbd8313ed055",
    displayName: "Jane",
  },
];

app.post("/auth/register", function (req, res) {
  var user = {
    username: req.body.username,
    password: req.body.password,
    displayName: req.body.displayName,
  };
  users.push(user);
  req.session.displayName = req.body.displayName;
  req.session.save(function () {
    res.redirect("/welcome");
  });
});

app.listen(3000, function () {
  console.log("Connected 3000 port is running!");
});
