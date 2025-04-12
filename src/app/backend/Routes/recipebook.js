const express = require('express');
const router = express.Router();
const recipebookController = require('../Controller/recipebookController');


// Get all recipebooks
router.get('/', recipebookController.getAllRecipeBooks);

// Post a recipe book
router.post('/', recipebookController.postRecipeBook);

// Delete a recipe book
router.delete('/', recipebookController.deleteRecipeBook);

// rename a recipe book
router.patch('/', recipebookController.updateRecipeBook);

module.exports = router;
