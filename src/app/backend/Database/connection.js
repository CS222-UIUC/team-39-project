const mysql = require('mysql');


const connection = mysql.createConnection({
  host: '127.', 
  user: 'cs222',
  password: '',
  database: 'cs222'
});

// For now, the database can only be accessed from the local machine, so how can we make it accessible from other machine.

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
});

