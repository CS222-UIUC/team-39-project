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
    const query = "SELECT * FROM Recipes Where RecipeId = ? ORDER BY Name ASC";
    connection.query(query, [recipeId], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(rows);
    });
  };
  
  // Post a new recipe
  const postRecipe = (req, res) => {
    res.json({ msg: 'Post a recipe' });
  };
  
  // Delete a recipe
  const deleteRecipe = (req, res) => {
    const { id } = req.params;
    res.json({ msg: `Delete recipe with id ${id}` });
  };
  
  // Update a recipe
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
  