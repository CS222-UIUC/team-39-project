import connection from '../Database/connection';
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
};
  
  // Delete a recipe
  const deleteRecipe = (req, res) => {
    console.log('deleteRecipe called');
    const { id } = req.params;
    const query = "DELETE FROM Recipes WHERE RecipeId = ?";
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Recipe not found" });
        }
        res.json({ msg: `Recipe with id ${id} deleted` });
    });
  };
  
  // Update a recipe
  // TODO
  const updateRecipe = (req, res) => {
    const { id } = req.params;
    res.json({ msg: `Update recipe with id ${id}` });
  };
  */

  const getOneRecipe = (req, res) => {
    const { username, book_name, recipe_name } = req.body;
  
    if (!username || !book_name || !recipe_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const getBookIdQuery = `
      SELECT rb.RecipeBookId
      FROM RecipeBooks rb
      JOIN FavRecipeBooks frb ON rb.RecipeBookId = frb.RecipeBookId
      WHERE frb.UserId = ? AND rb.Name = ?
    `;
    connection.query(getBookIdQuery, [username, book_name], (bookErr, bookResults) => {
      if (bookErr) return res.status(500).json({ error: bookErr.message });
      if (bookResults.length === 0) {
        return res.status(404).json({ error: 'Recipe book not found for user' });
      }
      const recipeBookId = bookResults[0].RecipeBookId;

      const getRecipeIdQuery = `
        SELECT r.RecipeId
        FROM Recipes r
        JOIN RecipesInRecipeBooks rirb ON r.RecipeId = rirb.RecipeId
        WHERE rirb.RecipeBookId = ? AND r.Name = ?
      `;
  
      connection.query(getRecipeIdQuery, [recipeBookId, recipe_name], (recipeIdErr, recipeIdResults) => {
        if (recipeIdErr) return res.status(500).json({ error: recipeIdErr.message });
        if (recipeIdResults.length === 0) {
          return res.status(404).json({ error: 'Recipe not found in this book' });
        }
  
        const recipeId = recipeIdResults[0].RecipeId;

        const getRecipeQuery = `
          SELECT Name AS recipe_name, Category AS recipe_category, Ingredients AS recipe_ingredients, Steps AS recipe_steps
          FROM Recipes
          WHERE RecipeId = ?
        `;
  
        connection.query(getRecipeQuery, [recipeId], (finalErr, recipeResults) => {
          if (finalErr) return res.status(500).json({ error: finalErr.message });
  
          const recipe = recipeResults[0];
          res.json({
            recipe_name: recipe.recipe_name,
            recipe_category: recipe.recipe_category,
            recipe_ingredients: recipe.recipe_ingredients,
            recipe_steps: recipe.recipe_steps
          });
        });
      });
    });
  };



const updateRecipe = (req, res) => {
  const { username, book_name, recipe_name, recipe_category, recipe_ingredients, recipe_steps } = req.body;

  if (!username || !book_name || !recipe_name || !recipe_category || !recipe_ingredients || !recipe_steps) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const getBookIdQuery = `
    SELECT rb.RecipeBookId
    FROM RecipeBooks rb
    JOIN FavRecipeBooks favb ON rb.RecipeBookId = favb.RecipeBookId
    WHERE favb.UserId = ? AND rb.Name = ?
  `;

  connection.query(getBookIdQuery, [username, book_name], (bookErr, bookResults) => {
    if (bookErr) return res.status(500).json({ error: bookErr.message });
    if (bookResults.length === 0) {
      return res.status(404).json({ error: 'Recipe book not found for user' });
    }

    const recipeBookId = bookResults[0].RecipeBookId;

    const getRecipeIdQuery = `
      SELECT r.RecipeId
      FROM Recipes r
      JOIN RecipesInRecipeBooks rirb ON r.RecipeId = rirb.RecipeId
      WHERE rirb.RecipeBookId = ? AND r.Name = ?
    `;

    connection.query(getRecipeIdQuery, [recipeBookId, recipe_name], (recipeIdErr, recipeIdResults) => {
      if (recipeIdErr) return res.status(500).json({ error: recipeIdErr.message });
      if (recipeIdResults.length === 0) {
        return res.status(404).json({ error: 'Recipe not found in this book' });
      }

      const recipeId = recipeIdResults[0].RecipeId;

      const updateQuery = `
        UPDATE Recipes
        SET Category = ?, Ingredients = ?, Steps = ?
        WHERE RecipeId = ?
      `;

      connection.query(updateQuery, [recipe_category, recipe_ingredients, recipe_steps, recipeId], (updateErr, _) => {
        if (updateErr) return res.status(500).json({ error: updateErr.message });

        res.json({ ok: true });
      });
    });
  });
};


const getRecipeList = (req, res) => {
  const sql = `
    SELECT frb.UserId AS username, r.Name AS recipe_name
    FROM FavRecipeBooks frb
    JOIN RecipesInRecipeBooks rirb ON frb.RecipeBookId = rirb.RecipeBookId
    JOIN Recipes r ON rirb.RecipeId = r.RecipeId
    ORDER BY frb.UserId ASC, r.Name ASC
  `;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

  module.exports = {
    // getAllRecipes,
    // getRecipeById,
    // postRecipe,
    // deleteRecipe,
    updateRecipe,
    getOneRecipe,
    getRecipeList,
  };