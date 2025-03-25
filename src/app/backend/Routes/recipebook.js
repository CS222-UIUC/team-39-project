const express = require('express');
const router = express.Router();
const recipebookController = require('../Controller/recipebookController');


// Get all recipebooks
router.get('/', recipebookController.getAllRecipeBooks);

// Get a single recipebook
router.get('/:id', recipebookController.getRecipeBookById);

// Post a recipe book
router.post('/', recipebookController.postRecipeBook);

// Delete a recipe book
router.delete('/:id', recipebookController.deleteRecipeBook);

// Update a recipe book
router.patch('/:id', recipebookController.updateRecipeBook);

module.exports = router;
