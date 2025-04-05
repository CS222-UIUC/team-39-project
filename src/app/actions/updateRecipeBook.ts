// TODO: Verify the correct way for connecting with backend
const express = require('express');
const router = express.Router();
const db = require('../Database/connection');

// PUT /api/recipebook/:id
router.put('/api/recipebook/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const query = 'UPDATE recipe_books SET name = ? WHERE id = ?';
    await db.promise().query(query, [name, id]);

    res.status(200).json({ success: true, message: 'Recipe book name updated' });
  } catch (err) {
    console.error('Error updating recipe book:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
