import mysql from 'mysql';

//mysql -u admin -p -h cs222.cxcwkyiweck5.us-east-2.rds.amazonaws.com -P 3306
const connection = mysql.createConnection({
  host: 'cs222.cxcwkyiweck5.us-east-2.rds.amazonaws.com', 
  user: 'admin',
  password: 'cs222database',
  database: 'db',
  port: 3306
});

// For now, the database can only be accessed from the local machine,
// so how can we make it accessible from other machine.

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
});

export default connection;