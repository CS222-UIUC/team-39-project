const express = require('express');
const router = express.Router();
const recipeController = require('../Controller/recipeController');

// Get all recipes
router.get('/', recipeController.getAllRecipes);

// Get a single recipe
router.get('/:id', recipeController.getRecipeById);

// Post a recipe
router.post('/', recipeController.postRecipe);

// Delete a recipe
router.delete('/:id', recipeController.deleteRecipe);

// Update a recipe
router.patch('/:id', recipeController.updateRecipe);

module.exports = router;
