require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')

// Import routes
const recipeRoute = require('./Routes/recipe');
const userRoute = require('./Routes/user');
const connection = require('./Database/connection');

const app = express();

//middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
  })

const port = process.env.PORT || 3000; //?

// routes
app.use('/api/recipe', recipeRoute);
app.use('/api/user', userRoute);

app.get('/', (req, res) => {
    res.send('Backend is working!');
});

//app.listen(port, '0.0.0.0', () => {
  //  console.log(`Server running on http://localhost:${port}`);
//});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
