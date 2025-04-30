import mysql from 'mysql';

const connection = mysql.createConnection({ /* config */ });

function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// 用法
const results = await queryAsync("SELECT * FROM Users WHERE id = ?", [123]);