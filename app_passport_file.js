var express = require("express");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var bodyParser = require("body-parser");
var pbkdf2 = require("pbkdf2-password");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var hasher = pbkdf2();

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
app.use(passport.initialize());
app.use(passport.session());
app.get("/count", function (req, res) {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send("count : " + req.session.count);
});

app.get("/auth/logout", function (req, res) {
  req.logout();
  req.session.save(function () {
    res.redirect('/welcome');
  })
});

app.get("/welcome", function (req, res) {
  if (req.user && req.user.displayName) {
    res.send(`
    <h1>hello, ${req.user.displayName} !</h1>
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

passport.serializeUser(function (user, done) {
  console.log("serializeUser", user);
  done(null, user.username);
});
passport.deserializeUser(function (id, done) {
  console.log("deserializeUser", id);
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    if (user.username === id) {
      return done(null, user);
    }
  }
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    var uname = username;
    var pwd = password;
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      if (uname === user.username) {
        return hasher(
          { password: pwd, salt: user.salt },
          function (err, pass, salt, hash) {
            if (hash === user.password) {
              console.log("LocalStrategy", user);
              done(null, user);
            } else {
              done(null, false);
            }
          }
        );
      }
    }
    done(null, false);
  })
);
app.post(
  "/auth/login",
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/auth/login",
    failureFlash: false,
  })
);

// app.post("/auth/login", function (req, res) {
//   var uname = req.body.username;
//   var pwd = req.body.password;
//   for (var i = 0; i < users.length; i++) {
//     var user = users[i];
//     if(uname === user.username){
//       return hasher({password:pwd, salt: user.salt, }, function (err, pass, salt, hash) {
//         if(hash === user.password){
//           req.session.displayName = user.displayName;
//           req.session.save(function () {
//             res.redirect('/welcome')
//           })
//         }else{
//           res.send('who are you? <a href ="/auth/login">log in</a>')
//         }
//       })
//     }
//     // if (uname === user.username && pbkdf2(pwd+user.salt) === user.password) {
//     //   req.session.displayName = user.displayName;
//     //   return req.session.save(function () {
//     //     res.redirect("/welcome");
//     //   });
//     // }
//   }
//   res.send('who are you? <a href ="/auth/login">log in</a>')
// });

// var salt = 'asdf1234!@#$'
var users = [
  {
    username: "jane",
    password:
      "wy3aXKhBRVcvyLzi3xZiecralO0/836dObMFbg4ZddLTcsOmipka7HSPRarPXryoU4la4OIjVaP8N8jw0vG1A/YenoNDFMjk+eL2B09K0tm4EzIJ0eqrbuYka84wvYwh59qBjttf1TELqWEVy50mVJaFFQiQUQh43bkutFVUPtg=",
    salt: "v4rZzwL2+e2A917wNDHuWbbV1h35CtGtO6b/P4CgnL6bwpviQ8ilA7qkwY2+S1DX+Fu0O4BxWwXMnjzwfHkJFA==",
    displayName: "Jane",
  },
];
app.post("/auth/register", function (req, res) {
  hasher({ password: req.body.password }, function (err, pass, salt, hash) {
    var user = {
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName,
    };
    users.push(user);
    req.login(user, function (err) {
      req.session.save(function () {
        res.redirect("/welcome");
      });
    });
  });
});
app.get("/auth/register", function (req, res) {
  var output = `
  <h1>REGISTER</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="user name">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});
app.listen(3000, function () {
  console.log("Connected 3000 port is running!");
});
