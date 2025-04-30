import connection from '../Database/connection.js';

/*
// Get all recipes
const getAllRecipes = (req, res) => {
    console.log('getAllRecipes called');
    const query = "SELECT * FROM Recipes ORDER BY Name ASC";
    connection.query(query, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(rows);
    });
  };

  // Get a single recipe
  const getRecipeById = (req, res) => {
    console.log('getRecipeById called');
    const recipeId = req.params.id;
    const query = "SELECT * FROM Recipes WHERE RecipeId = ? ORDER BY Name ASC";
    //res.setHeader("Access-Control-Allow-Origin", "*");
    //res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    //res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    connection.query(query, [recipeId], (err, rows) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: err });
        }
        if (rows.length === 0) {
            return res.status(404).json({ msg: "Recipe not found" });
        }
        res.json(rows[0]);
    });
  };
  
  // Post a new recipe
  
  const postRecipe = (req, res) => {
    console.log('postRecipe called');
    const { userId, name} = req.body;

    if (!userId || !name) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    //Id should be handled by sql auto-increment
    const query = "INSERT INTO Recipes (Name) VALUES (?)";
    connection.query(query, [name], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        
        const recipeId = result.insertId; //Id should be handled by sql auto-increment
        const favQuery = "INSERT INTO FavRecipes (UserId, RecipeId) VALUES (?, ?)";
        connection.query(favQuery, [userId, recipeId], (favErr, favResult) => {
            if (favErr) {
                return res.status(500).json({ error: favErr });
            }
            res.status(201).json({ msg: "Recipe added", recipeId });
        });
    });
}; */

const postRecipe = (req, res) => {
  const { book_id, recipe_name } = req.body;
  console.log('postRecipe called', book_id, recipe_name);
  if (!book_id || recipe_name === undefined) {
    return res.status(400).json({ error: 'Missing field' });
  }

  connection.query(
    'INSERT INTO Recipes (Name, Category) VALUES (?, ?)',
    [recipe_name, 'Uncategorized'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const newRecipeId = result.insertId;

      connection.query(
        'INSERT INTO RecipesInRecipeBooks (RecipeId, RecipeBookId) VALUES (?, ?)',
        [newRecipeId, book_id],
        (linkErr) => {
          if (linkErr) return res.status(500).json({ error: linkErr.message });
          return res.status(200).json({ ok: true });
        }
      );
    }
  );
};

  
const deleteRecipe = (req, res) => {
  const { recipe_id } = req.body;

  if (!recipe_id) {
    return res.status(400).json({ error: 'Missing recipe_id' });
  }

  connection.query('DELETE FROM Recipes WHERE RecipeId = ?', [recipe_id], (err) => {
    if (err) {
      console.error('Error deleting recipe:', err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({ ok: true });
  });
};

  /*
  // Update a recipe
  // TODO
  const updateRecipe = (req, res) => {
    const { id } = req.params;
    res.json({ msg: `Update recipe with id ${id}` });
  };
  */

  const getOneRecipe = (req, res) => { 
    const { recipe_id } = req.query;
    if (!recipe_id) return res.status(400).json({ error: 'Missing recipe_id' });
    console.log('getOneRecipe called', recipe_id);
    connection.query('SELECT * FROM Recipes WHERE RecipeId = ?', [recipe_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'Recipe not found' });
  
      const recipe = results[0];
      res.status(200).json({
        recipe_name: recipe.Name,
        recipe_category: recipe.Category,
        recipe_ingredients: recipe.Ingredients,
        recipe_steps: recipe.Steps
      });
    });
  };
  
const updateRecipe = (req, res) => {
    const { recipe_id, recipe_name, recipe_category, recipe_ingredients, recipe_steps } = req.body;
    console.log('updateRecipe called', recipe_id);
    if (!recipe_id || recipe_name === undefined || !recipe_category) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const updateQuery = `
      UPDATE Recipes
      SET Name = ?, Category = ?, Ingredients = ?, Steps = ?
      WHERE RecipeId = ?
    `;
    connection.query(updateQuery, [recipe_name, recipe_category, recipe_ingredients, recipe_steps, recipe_id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ ok: true });
    });
  };
  


export {
   updateRecipe, 
   getOneRecipe, 
   //getRecipeList,
   deleteRecipe,
   postRecipe
  };