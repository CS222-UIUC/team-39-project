import express from 'express'
const router = express.Router();
import * as recipebookController from '../Controller/recipebookController.js';


// Get all recipebooks
router.get('/', recipebookController.getAllRecipeBooks);

// Post a recipe book
router.post('/', recipebookController.postRecipeBook);

// Delete a recipe book
router.delete('/', recipebookController.deleteRecipeBook);

// rename a recipe book
router.patch('/', recipebookController.updateRecipeBook);

export default router;