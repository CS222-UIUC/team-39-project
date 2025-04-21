import connection from '../Database/connection.js';

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
  
// const updateRecipeBook = (req, res) => {
//     console.log('updateRecipeBook called');
//     const { book_id, new_book_name } = req.body;
  
//     if (!username) {
//       return res.status(400).json({ error: "Username is required" });
//     }
//     if (!book_name) {
//       return res.status(400).json({ error: "Book name is required" });
//     }
//     if (!new_book_name) {
//       return res.status(400).json({ error: "New book name is required" });
//     }
//     // if (!username || !book_name || !new_book_name) {
//     //   return res.status(400).json({ error: "Missing required fields" });
//     // }
  
//     const verifyQuery = `
//       SELECT rb.RecipeBookId
//       FROM RecipeBooks rb
//       JOIN FavRecipeBooks favb ON rb.RecipeBookId = favb.RecipeBookId
//       WHERE rb.Name = ? AND favb.UserId = ?
//     `;
  
//     connection.query(verifyQuery, [book_name, username], (verifyErr, results) => {
//       if (verifyErr) {
//         console.error('Verification failed:', verifyErr);
//         return res.status(500).json({ error: verifyErr });
//       }
  
//       if (results.length === 0) {
//         return res.status(404).json({ error: "Recipe book not found or not associated with this user" });
//       }
  
//       const recipeBookId = results[0].RecipeBookId;
  
//       const updateQuery = `
//         UPDATE RecipeBooks SET Name = ? WHERE RecipeBookId = ?
//       `;
  
//       connection.query(updateQuery, [new_book_name, recipeBookId], (updateErr) => {
//         if (updateErr) {
//           console.error('Update failed:', updateErr);
//           return res.status(500).json({ error: updateErr });
//         }
  
//         console.log(`Recipe book name updated from '${book_name}' to '${new_book_name}'`);
//         res.json({ ok: true });
//       });
//     });
//   };
  
  // http://localhost:2333/api/recipebook/change_name
  // - type: patch
  // - input: book_id, new_book_name
  // - process: change book name. Only owner can change name. This function will only be called by the owner.
  // - return: response.ok == True if successful

  const changeRecipeBookName = (req, res) => {
    console.log('changeRecipeBookName called');
    const { book_id, new_book_name } = req.body;
  
    if (!book_id || !new_book_name) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }
  
    const updateQuery = `
      UPDATE RecipeBooks SET Name = ? WHERE RecipeBookId = ?
    `;
  
    connection.query(updateQuery, [new_book_name, book_id], (err, result) => {
      if (err) {
        console.error('Error updating recipe book name:', err);
        return res.status(500).json({ ok: false, error: err.message });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ ok: false, error: 'Recipe book not found' });
      }
  
      console.log(`Recipe book ID ${book_id} renamed to '${new_book_name}'`);
      res.json({ ok: true });
    });
  };
  
  const inviteReadOnly = (req, res) => {
    console.log('inviteReadOnly called');
    const { username, invited_username, book_id } = req.body;
    if (!username || !invited_username || !book_id) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }
  
    // Make sure invited user exists
    const checkUserQuery = `
      SELECT * FROM Users WHERE UserId = ?
    `;
    connection.query(checkUserQuery, [invited_username], (userErr, userResults) => {
      if (userErr) {
        return res.status(500).json({ ok: false, error: userErr.message });
      }
      if (userResults.length === 0) {
        return res.status(404).json({ ok: false, error: "Invited user does not exist" });
      }
  
      // Insert into ReadOnly table
      const insertQuery = `
        INSERT INTO ReadOnly (UserId, RecipeBookId) VALUES (?, ?)
      `;
      connection.query(insertQuery, [invited_username, book_id], (insertErr) => {
        if (insertErr) {
          if (insertErr.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ ok: false, error: "User already has read-only access to this book" });
          }
          return res.status(500).json({ ok: false, error: insertErr.message });
        }
  
        console.log(`User ${invited_username} added to ReadOnly for book ${book_id}`);
        res.json({ ok: true });
      });
    });
  };
  
  const inviteCoedit = (req, res) => {
    console.log('inviteCoedit called');
    const { username, invited_username, book_id } = req.body;
  
    // Step 1: Validate input
    if (!username || !invited_username || !book_id) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }
  
    // Step 2: Check if invited user exists
    const checkUserQuery = `SELECT * FROM Users WHERE UserId = ?`;
    connection.query(checkUserQuery, [invited_username], (userErr, userResults) => {
      if (userErr) {
        return res.status(500).json({ ok: false, error: userErr.message });
      }
      if (userResults.length === 0) {
        return res.status(404).json({ ok: false, error: "Invited user does not exist" });
      }
  
      // Step 3: Insert into Coedit table
      const insertQuery = `INSERT INTO Coedit (UserId, RecipeBookId) VALUES (?, ?)`;
      connection.query(insertQuery, [invited_username, book_id], (insertErr) => {
        if (insertErr) {
          if (insertErr.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ ok: false, error: "User already has co-edit access to this book" });
          }
          return res.status(500).json({ ok: false, error: insertErr.message });
        }
  
        console.log(`User ${invited_username} added to Coedit for book ${book_id}`);
        res.json({ ok: true });
      });
    });
  };
    
  export {
    getAllRecipeBooks,
    postRecipeBook,
    deleteRecipeBook,
    //updateRecipeBook,
    changeRecipeBookName,
    inviteReadOnly,
    inviteCoedit,
  };
  