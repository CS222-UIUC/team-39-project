import mysql from 'mysql';
import dotenv from 'dotenv';

// Load .env file locally, Render uses its own env vars
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
    console.log('dev mode')
}

//mysql -u admin -p -h cs222.cxcwkyiweck5.us-east-2.rds.amazonaws.com -P 3306
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
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