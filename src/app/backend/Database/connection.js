const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'username',
  password: 'password',
  database: 'databasename'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
});

