const sqlite3 = require('sqlite3').verbose();
const path = require('path');
let file = path.join(__dirname, '/world_sql_content_5c2e1bf00371d79d06bc403ef84a06dc.sqlite3');
let db = new sqlite3.Database(file, sqlite3.OPEN_READONLY,  (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
})

exports.searchDB = (sql, callback) => {
  db.serialize(()=>{
    db.get(sql, (err, rows) => {
    if (err) throw err;
    else {
      callback(rows);
    }
    })
  });
} 
