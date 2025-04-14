import express from 'express'
import dotenv from 'dotenv'
dotenv.config();

const app = express();
app.use(express.json());

import cors from 'cors'
app.use(cors());

// --- CORS Configuration ---
// Define allowed origins
const allowedOrigins = [
    'http://localhost:3000', // Your local frontend dev server port (adjust if different)
    'https://flavorbook.vercel.app', // URL of your deployed frontend (if you have one)
    'https://flavorbook-git-zory-zoryzhangs-projects.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // If you need to handle cookies or authorization headers
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions)); // Use the cors middleware *before* your routes

// --- End CORS Configuration ---


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

const port = process.env.PORT || 2333;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});