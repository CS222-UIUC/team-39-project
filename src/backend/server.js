import express from 'express'
import dotenv from 'dotenv'
dotenv.config();

const app = express();
app.use(express.json());

import cors from 'cors'
app.use(cors());

const port = process.env.PORT;

//const connection = require('./Database/connection');

// Import routes
import recipeRoute from './Routes/recipe.js'
import userRoute from './Routes/user.js'
import recipebookRoute from './Routes/recipebook.js'

app.use(express.json());
app.use('/api/recipe', recipeRoute);
app.use('/api/user', userRoute);
app.use('/api/recipebook', recipebookRoute);

app.get('/', (req, res) => {
    res.send('Backend is working!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});