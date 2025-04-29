import express from 'express'
const router = express.Router();
import * as recipebookController from '../Controller/recipebookController.js';


// // Get all recipebooks
router.get('/', recipebookController.getAllRecipeBooks);

// Post a recipe book
router.post('/', recipebookController.postRecipeBook);

// Delete a recipe book
router.delete('/', recipebookController.deleteRecipeBook);

router.get('/content', recipebookController.getRecipeBookContent);
// rename a recipe book

router.patch('/change_name', recipebookController.changeRecipeBookName);

router.post('/invite_readonly', recipebookController.inviteReadOnly);

router.post('/invite_coedit', recipebookController.inviteCoedit);


export default router;