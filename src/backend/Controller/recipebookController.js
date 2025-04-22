import connection from '../Database/connection.js';

// Get all recipeBooks
const getAllRecipeBooks = (req, res) => {
  console.log('getAllRecipeBooks called');
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }
  connection.query(
    `SELECT RecipeBookId AS book_id, Name AS book_name FROM RecipeBooks WHERE OwnerId = ?`,
    [username],
    (err, ownedBooks) => {
      if (err) return res.status(500).json({ error: 'DB error 1' });

      connection.query(
        `SELECT rb.RecipeBookId AS book_id, rb.Name AS book_name
         FROM RecipeBooks rb JOIN Coedit c ON rb.RecipeBookId = c.RecipeBookId
         WHERE c.UserId = ?`,
        [username],
        (err, coeditBooks) => {
          if (err) return res.status(500).json({ error: 'DB error 2' });

          connection.query(
            `SELECT rb.RecipeBookId AS book_id, rb.Name AS book_name
             FROM RecipeBooks rb JOIN ReadOnly r ON rb.RecipeBookId = r.RecipeBookId
             WHERE r.UserId = ?`,
            [username],
            (err, readOnlyBooks) => {
              if (err) return res.status(500).json({ error: 'DB error 3' });

              const books = [
                ...ownedBooks.map(b => ({
                  book_id: b.book_id,
                  book_displayname: b.book_name
                })),
                ...coeditBooks.map(b => ({
                  book_id: b.book_id,
                  book_displayname: `${b.book_name} (co-edit)`
                })),
                ...readOnlyBooks.map(b => ({
                  book_id: b.book_id,
                  book_displayname: `${b.book_name} (read only)`
                }))
              ];

              res.json(books);
            }
          );
        }
      );
    }
  );
};


// Post a new recipeBook for a user
const postRecipeBook = (req, res) => {
  console.log('postRecipeBook called');
  const { username, book_name } = req.body;

  console.log('createRecipeBook called:', username, book_name);

  if (!username || !book_name) {
    return res.status(400).json({ error: 'Missing Fields' });
  }

  const insertQuery = `
    INSERT INTO RecipeBooks (Name, OwnerId)
    VALUES (?, ?)
  `;

  connection.query(insertQuery, [book_name, username], (err, result) => {
    if (err) {
      console.error('Error in createRecipeBook:', err);
      return res.status(500).json({ ok: false, error: err.message });
    }
    res.json({ ok: true });
  });
};
  
  // Delete a recipeBook
  const deleteRecipeBook = (req, res) => {
    console.log('deleteRecipeBook called');
    const { username, book_id } = req.body;

    console.log('deleteRecipeBook called:', username, book_id);
  
    if (!username || !book_id) {
      return res.status(400).json({ ok: false, error: 'username and book_id are required' });
    }
  
    // Step 1: Check if user has any access to the book
    const accessCheckQuery = `
      SELECT 'owner' AS role FROM RecipeBooks WHERE RecipeBookId = ? AND OwnerId = ?
      UNION
      SELECT 'coedit' AS role FROM Coedit WHERE RecipeBookId = ? AND UserId = ?
      UNION
      SELECT 'readonly' AS role FROM ReadOnly WHERE RecipeBookId = ? AND UserId = ?
    `;
  
    connection.query(accessCheckQuery, [book_id, username, book_id, username, book_id, username], (err, results) => {
      if (err) {
        console.error('Access check error:', err);
        return res.status(500).json({ ok: false, error: err.message });
      }
  
      const roles = results.map(r => r.role);
      const isOwner = roles.includes('owner');
  
      if (isOwner) {
        const deleteBookQuery = `DELETE FROM RecipeBooks WHERE RecipeBookId = ? AND OwnerId = ?`;
  
        connection.query(deleteBookQuery, [book_id, username], (err2) => {
          if (err2) {
            console.error('Book delete error:', err2);
            return res.status(500).json({ ok: false, error: err2.message });
          }
          return res.json({ ok: true, message: 'Book deleted (owner).' });
        });
  
      } else {
        connection.query(
          `DELETE FROM Coedit WHERE RecipeBookId = ? AND UserId = ?`,
          [book_id, username],
          (err1, result1) => {
            if (err1) {
              console.error('Delete from Coedit error:', err1);
              return res.status(500).json({ ok: false, error: err1.message });
            }
        
            connection.query(
              `DELETE FROM ReadOnly WHERE RecipeBookId = ? AND UserId = ?`,
              [book_id, username],
              (err2, result2) => {
                if (err2) {
                  console.error('Delete from ReadOnly error:', err2);
                  return res.status(500).json({ ok: false, error: err2.message });
                }
        
                return res.json({ ok: true, message: 'Access removed (coedit/read-only).' });
              }
            );
          }
        );
      }
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
    // Check if the invited user exists is not necessary here, thanks to our frontend friends.
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
    if (!username || !invited_username || !book_id) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }
    // Check if the invited user exists is not necessary here, thanks to our frontend friends.
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
  