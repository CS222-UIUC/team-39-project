const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT;

const connection = require('./Database/connection');

// Import routes
const recipeRoute = require('./Routes/recipe');
const userRoute = require('./Routes/user');

app.use('/api/recipe', recipeRoute);
app.use('/api/user', userRoute);

app.get('/', (req, res) => {
    res.send('Backend is working!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});