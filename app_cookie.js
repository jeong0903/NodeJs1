var express = require("express");
var cookieParser = require("cookie-parser");
var app = express();
app.use(cookieParser('1234!@#'));

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
/* 
cart = {
  1(상품id) : 2(클릭 수),
  2(상품id) : 1(클릭 수)
}
*/
app.get("/cart/:id", function (req, res) {
  var id = req.params.id;
  if (req.signedCookies.cart) {
    var cart = req.signedCookies.cart;
  } else {
    var cart = {};
  }
  if (!cart[id]) {
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id]) + 1;
  res.cookie("cart", cart, {signed: true});
  res.redirect("/cart");
});

app.get("/cart", function (req, res) {
  var cart = req.signedCookies.cart;
  if (!cart) {
    res.send("Empty!");
  } else {
    var output = "";
    for (var id in cart) {
      output += `<li>${products[id].title}
      (${cart[id]})</li>`;
    }
  }
  res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href="/products">Products List</a>`);
});
app.listen(3000, function () {
  console.log("Connected 3000 port is running!");
});
