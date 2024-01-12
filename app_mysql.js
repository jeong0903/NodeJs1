var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin1234",
  database: "o2",
});
conn.connect();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.set("views", "./views_mysql");
app.set("view engine", "pug");
app.get("/topic/new", function (req, res) {
  fs.readdir("data", function (err, files) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
    res.render("new", { topics: files });
  });
});
app.get(["/topic", "/topic/:id"], function (req, res) {
  var sql = "SELECT id, title FROM topic";
  conn.query(sql, function (err, topics, files) {
    res.render("view", { topics: topics});
  })
  /*  // topics 정보
  fs.readdir("data", function (err, files) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
    var id = req.params.id;
    if (id) {
      // id값이 있을 때
      fs.readFile("data/" + id, "utf8", function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        }
        res.render("view", { topics: files, title: id, description: data });
      });
    } else {
      // id값이 없을 때
      res.render("view", {
        topics: files,
        title: "Welcome",
        description: "Hello world!",
      });
    }
  });
*/
});

app.post("/topic", function (req, res) {
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile("data/" + title, description, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
    res.redirect("/topic/" + title);
  });
});
app.listen(3000, function () {
  console.log("Conneted, 3000 port!");
});
