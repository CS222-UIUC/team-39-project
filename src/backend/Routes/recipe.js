import express from 'express'
import * as recipeController from '../Controller/recipeController.js';
const router = express.Router();


// // Get all recipes
// router.get('/', recipeController.getAllRecipes);

// // Get a single recipe
// router.get('/:id', recipeController.getRecipeById);

// Post a recipe
router.post('/', recipeController.postRecipe);

// Delete a recipe
router.delete('/', recipeController.deleteRecipe);

// // Update a recipe
// router.patch('/', recipeController.updateRecipe);


// Get a single recipe by username, book name, and recipe name
router.get('/get_one_recipe', recipeController.getOneRecipe);

// Update a recipe
router.patch('/update_recipe', recipeController.updateRecipe);

// Get the list of all recipes
//router.get('/get_recipe_list', recipeController.getRecipeList);

export default router;
