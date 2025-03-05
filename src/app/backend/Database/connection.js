const mysql = require('mysql');


const connection = mysql.createConnection({
  host: '127.0.0.1', 
  user: 'cs222',
  password: '',
  database: 'cs222'
});
// Currently, it only allow local connections but how can we make it accessible from other machines?

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
});

