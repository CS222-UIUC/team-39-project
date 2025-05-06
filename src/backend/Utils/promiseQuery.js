import connection from '../Database/connection.js';

//see:https://www.reddit.com/r/node/comments/p1xjre/express_mysql_how_to_write_better_promises/

const promiseQuery = (sql, params) => new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  
export default promiseQuery;