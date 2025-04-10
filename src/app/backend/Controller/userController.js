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
    db.query('SELECT * FROM Users WHERE UserId = ?', [username], async (err, results) => {
      if (err) {
        console.error('Error checking existing user:', err);
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        console.warn(`Signup rejected: Username '${username}' already in use.`);
        return res.status(400).json({ error: 'Username already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query('INSERT INTO Users (UserId, PassWord) VALUES (?, ?)', [username, hashedPassword], (err2) => {
        if (err2) {
          console.error('Error inserting user:', err2);
          return res.status(500).json({ error: err2.message });
        }

        const token = createToken(username);
        const defaultBookName = `${username}'s Beginner Recipe Book`;
        // Create a default recipe book for the user
        db.query('INSERT INTO RecipeBooks (Name) VALUES (?)', [defaultBookName], (bookErr, bookResult) => {
          if (bookErr) {
            console.error('Error creating default recipe book:', bookErr);
            return res.status(500).json({ error: bookErr.message });
          }

          const recipeBookId = bookResult.insertId;

          db.query('INSERT INTO FavRecipeBooks (UserId, RecipeBookId) VALUES (?, ?)', [username, recipeBookId], (favErr) => {
            if (favErr) {
              console.error('Error adding to FavRecipeBooks:', favErr);
              return res.status(500).json({ error: favErr.message });
            }

            // beginenr sample recipe content
            `${username}'s Beginner Recipe Book`
            const example_recipe_name = `${username}'s Beginner's Guide to FlavorBook`
            const example_ingredients = `### Instructions
You can use the button on the top to switch between preview and editing modes.
Note that you need an empty line between paragraphs. 
Single line breaks **will not work**.

You can use the button on the *top right* to enter fullscreen mode.
When you insert an image, patiently wait for a few seconds, then you will see something like \`![userphoto](some_sort_of_url_here.jpg)\`, and you will see the image once you switch back to preview mode.

### Below is an example of ingredients for a recipe "Grilled Chicken as in Chipotle"
Here is an example of how you can use this space for ingredients.

* Chicken thigh: 2 lb
* Oil: 4 tbsp
* Adobo chipotle: 2 tbsp + 1.5 tsp
* Ancho pepper: 2 tsp
* Ground cumin: 1/2 tbsp
* Dried oregano: 2 tsp
* kosher salt: 2 tsp
* Black pepper`;

            const example_steps = `Here is an example of how you can use this space for steps.

1. Mix everything together to marinate the chicken overnight.
2. Preheat the grill on medium high.
3. Grill a whole piece of thigh for 10-15 min.
4. Rest for 5min.
5. Cut into smaller pieces.`;

            const defaultRecipeQuery = `
              INSERT INTO Recipes (Name, Ingredients, Steps, Category)
              VALUES (?, ?, ?, ?)
            `;

            db.query(
              defaultRecipeQuery,
              [example_recipe_name, example_ingredients, example_steps, 'Sample'],
              (recipeErr, recipeResult) => {
                if (recipeErr) {
                  console.error('Error adding default recipe:', recipeErr);
                  return res.status(500).json({ error: recipeErr.message });
                }

                const newRecipeId = recipeResult.insertId;

                // add recipe to the default recipe book
                db.query(
                  'INSERT INTO RecipesInRecipeBooks (RecipeId, RecipeBookId) VALUES (?, ?)',
                  [newRecipeId, recipeBookId],
                  (linkErr) => {
                    if (linkErr) {
                      console.error('Error linking recipe to recipe book:', linkErr);
                      return res.status(500).json({ error: linkErr.message });
                    }

                    console.log(`Signup and default setup complete for user '${username}'`);
                    return res.status(200).json({ username, token });
                  }
                );
              }
            );
          });
        });
      });
    });
  } catch (err) {
    console.error('Unexpected error during signup:', err);
    return res.status(500).json({ error: err.message });
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