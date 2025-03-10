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
    const { id } = req.params;
    res.json({ msg: `Get recipe with id ${id}` });
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
  