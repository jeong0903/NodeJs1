var express = require("express");
var cookieParser = require("cookie-parser");
var app = express();
app.use(cookieParser());

var products = {
  1: { title: "The history of web 1" },
  2: { title: "The next web" },
};

app.get("/products", function (req, res) {
  var output = "";
  for (var name in products) {
    output += `
      <li>
        <a href="/cart/${name}">${products[name].title}</a>
      </li>`;
  }
  res.send(`
    <h1>Products</h1>
    <ul>${output}</ul>
    <a href="/cart">Cart
    `);
});

app.listen(3000, function () {
  console.log("Connected 3000 port is running!");
});
