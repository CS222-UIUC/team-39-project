const connection = require('../Database/connection');

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
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
  
  module.exports = {
    getAllRecipes,
    getRecipeById,
    postRecipe,
    deleteRecipe,
    updateRecipe,
  };
  