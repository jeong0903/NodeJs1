var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var mysql = require("mysql");
const { result } = require("underscore");
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
app.get("/topic/add", function (req, res) {
  var sql = "SELECT id, title FROM topic";
  conn.query(sql, function (err, topics, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
    res.render("add", { topics: topics });
  });
});
app.post("/topic/add", function (req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = "INSERT INTO topic (title, description, author) VALUES(?, ?, ?)";
  conn.query(sql, [title, description, author], function (err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/topic/" + result.insertId);
    }
  });
});
app.get(["/topic", "/topic/:id"], function (req, res) {
  var sql = "SELECT id, title FROM topic";
  conn.query(sql, function (err, topics, files) {
    var id = req.params.id;
    if (id) {
      var sql = "SELECT * FROM topic WHERE id=?";
      conn.query(sql, [id], function (err, topic, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.render("view", { topics: topics, topic: topic[0] });
        }
      });
    } else {
      res.render("view", { topics: topics });
    }
  });
});

app.listen(3000, function () {
  console.log("Conneted, 3000 port!");
});
