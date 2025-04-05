const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Database/connection'); 
require('dotenv').config();

const createToken = (UserId) => {
  return jwt.sign({ UserId }, process.env.SECRET, { expiresIn: '3d' });
};

// signup a user
const signupUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields must be filled!' });
  }

  try {
    console.log(`Attempting to sign up user '${username}'`);
    // Check if user exists
    db.query('SELECT * FROM Users WHERE UserId = ?', [username], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) return res.status(400).json({ error: 'Username already in use' });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.query('INSERT INTO Users (UserId, PassWord) VALUES (?, ?)', [username, hashedPassword], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });


        const token = createToken(name);
        res.status(200).json({ name, token });
        console.log(`Signup successful for user '${name}'`);

      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// login a user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields must be filled!' });
  }

  try {
    db.query('SELECT * FROM Users WHERE UserId = ?', [username], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(400).json({ error: 'Incorrect username' });

      const user = results[0];
      const match = await bcrypt.compare(password, user.PassWord);

      if (!match) return res.status(400).json({ error: 'Incorrect password' });

      const token = createToken(username);
      res.status(200).json({ username, token });
      console.log(`login successful for user '${username}'`);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signupUser, loginUser };