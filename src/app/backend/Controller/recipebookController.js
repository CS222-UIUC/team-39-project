const connection = require('../Database/connection');

// Get all recipeBooks
const getAllRecipeBooks = (req, res) => {
  console.log('getAllRecipeBooks called');
  const { username } = req.query; 
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  const query = `
    SELECT *
    FROM RecipeBooks rb
    JOIN FavRecipeBooks favb ON rb.RecipeBookId = favb.RecipeBookId
    WHERE favb.UserId = ?
    ORDER BY rb.Name ASC
  `;
  connection.query(query, [username], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

  
// Post a new recipeBook for a user
const postRecipeBook = (req, res) => {
  console.log('postRecipeBook called');
  const { username, book_name } = req.body;
  if (!username || !book_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const query = "INSERT INTO RecipeBooks (Name) VALUES (?)";
  connection.query(query, [book_name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    const recipeBookId = result.insertId;
    const favQuery = "INSERT INTO FavRecipeBooks (UserId, RecipeBookId) VALUES (?, ?)";
    connection.query(favQuery, [username, recipeBookId], (favErr) => {
      if (favErr) return res.status(500).json({ error: favErr });
      res.status(201).json({ success: true, recipeBookId });
    });
  });
};
  
  // Delete a recipeBook
  const deleteRecipeBook = (req, res) => {
    console.log('deleteRecipeBook called');
    const { username, book_name } = req.body;
  
    if (!username || !book_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const verifyQuery = `
      SELECT rb.RecipeBookId
      FROM RecipeBooks rb
      JOIN FavRecipeBooks favb ON rb.RecipeBookId = favb.RecipeBookId
      WHERE rb.Name = ? AND favb.UserId = ?
    `;
    // Verify if the book exists and is associated with the user
    connection.query(verifyQuery, [book_name, username], (verifyErr, results) => {
      if (verifyErr) {
        console.error('Verification query failed:', verifyErr);
        return res.status(500).json({ error: verifyErr });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Book not found or not associated with this user" });
      }
  
      const recipeBookId = results[0].RecipeBookId;
      console.log(`Verified book '${book_name}' for user '${username}'`);
   
      const removeFavQuery = `
        DELETE FROM FavRecipeBooks WHERE UserId = ? AND RecipeBookId = ?
      `;
      
      connection.query(removeFavQuery, [username, recipeBookId], (favDelErr) => {
        if (favDelErr) {
          console.error('Error removing from FavRecipeBooks:', favDelErr);
          return res.status(500).json({ error: favDelErr });
        }
  
        console.log(`Book '${book_name}' removed from user's favorites.`);
        const deleteBookQuery = `
          DELETE FROM RecipeBooks WHERE RecipeBookId = ?
        `;
        connection.query(deleteBookQuery, [recipeBookId], (deleteErr) => {
          if (deleteErr) {
            console.error('Error deleting book:', deleteErr);
            return res.status(500).json({ error: deleteErr });
          }
  
          console.log(`Book '${book_name}' fully deleted from database.`);
          res.json({ success: true, msg: `Book '${book_name}' fully deleted.` });
        });
      });
    });
  };
  
  
  // Update a recipeBook
  // TODO
  const updateRecipeBook = (req, res) => {
    const { id } = req.params;

    res.json({ msg: `Update recipeBook with id ${id}` });
  };
  
  
  module.exports = {
    getAllRecipeBooks,
    postRecipeBook,
    deleteRecipeBook,
    updateRecipeBook,
  };
  