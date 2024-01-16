var express = require("express");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var sha = require("sha256");
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
    <a href="/auth/logout">log out</a>
    `);
  } else {
    res.send(`
    <h1>Welcome</h1>
    <ul>
    <li><a href="/auth/login">Login</a></li>
    <li><a href="/auth/register">Register</a></li>
    </ul>
    `);
  }
});

app.post("/auth/login", function (req, res) {
  var uname = req.body.username;
  var pwd = req.body.password;
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    if (uname === user.username && sha(pwd+user.salt) === user.password) {
      req.session.displayName = user.displayName;
      return req.session.save(function () {
        res.redirect("/welcome");
      });
    }
  }
  res.send('who are you? <a href ="/auth/login">log in</a>')
});
// var salt = 'asdf1234!@#$'
var users = [
  {
    username: "jane",
    password: '4b5f2495286d9f6d7c10b2b502087931f63e2bd25a87a686c2615bcd94f0bf30',
    salt: 'salt111',
    displayName: "Jane",
  },
  {
    username: "user2",
    password: '4b115e6ef92b3ef82edef500b21d6a208717a42ce105c81d03c4492f392668e1',
    salt: 'salt222',
    displayName: "Kermit",
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
