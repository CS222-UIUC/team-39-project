//const connection = require('../database/connection');

// Get all recipes
const getAllRecipes = (req, res) => {
    res.json({ msg: 'Get all recipes' });
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
  