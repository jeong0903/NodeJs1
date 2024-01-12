var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin1234",
  database: "o2",
});

conn.connect();

// var sql = 'SELECT * FROM topic'
// conn.query(sql, function (err, rows, fields) {
//     if(err){
//         console.log(err);
//     } else {
//         for (var i = 0; i < rows.length; i++){
//             console.log(rows[i].author);
//         }
//     }
// });

var sql = `DELETE FROM topic 
           WHERE id=? `;
var params = [3];
conn.query(sql, params, function (err, rows, fields) {
  if (err) {
    console.log(err);
  } else {
    console.log(rows.affectedRows);
  }
});
conn.end();
