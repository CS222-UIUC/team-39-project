import promiseQuery from '../Utils/promiseQuery.js';


// Get all recipeBooks
const getAllRecipeBooks = async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'username is required' });
  try {
    const [ownedBooks, coeditBooks, readOnlyBooks] = await Promise.all([
      promiseQuery(`SELECT RecipeBookId AS book_id, Name AS book_name FROM RecipeBooks WHERE OwnerId = ?`, [username]),
      promiseQuery(`SELECT rb.RecipeBookId AS book_id, rb.Name AS book_name FROM RecipeBooks rb JOIN Coedit c ON rb.RecipeBookId = c.RecipeBookId WHERE c.UserId = ?`, [username]),
      promiseQuery(`SELECT rb.RecipeBookId AS book_id, rb.Name AS book_name FROM RecipeBooks rb JOIN ReadOnly r ON rb.RecipeBookId = r.RecipeBookId WHERE r.UserId = ?`, [username])
    ]);

    const books = [
      ...ownedBooks.map(b => ({ book_id: b.book_id, book_displayname: b.book_name })),
      ...coeditBooks.map(b => ({ book_id: b.book_id, book_displayname: `${b.book_name} (co-edit)` })),
      ...readOnlyBooks.map(b => ({ book_id: b.book_id, book_displayname: `${b.book_name} (read only)` }))
    ];

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const postRecipeBook = async (req, res) => {
  console.log('postRecipeBook called');
  const { username, book_name } = req.body;

  console.log('createRecipeBook called:', username, book_name);

  if (!username || book_name === undefined) {
    return res.status(400).json({ error: 'Missing Fields' });
  }

  try {
    await promiseQuery(`INSERT INTO RecipeBooks (Name, OwnerId) VALUES (?, ?)`, [book_name, username]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
  
  const deleteRecipeBook = async (req, res) => {
    const { username, book_id } = req.body;
    if (!username || !book_id) return res.status(400).json({ ok: false, error: 'username and book_id are required' });
    try {
      const results = await promiseQuery(`
        SELECT 'owner' AS role FROM RecipeBooks WHERE RecipeBookId = ? AND OwnerId = ?
        UNION
        SELECT 'coedit' AS role FROM Coedit WHERE RecipeBookId = ? AND UserId = ?
        UNION
        SELECT 'readonly' AS role FROM ReadOnly WHERE RecipeBookId = ? AND UserId = ?
      `, [book_id, username, book_id, username, book_id, username]);
  
      const roles = results.map(r => r.role);
      if (roles.includes('owner')) {
        await promiseQuery(`DELETE FROM ReadOnly WHERE RecipeBookId = ?`, [book_id])
        await promiseQuery(`DELETE FROM RecipeBooks WHERE RecipeBookId = ?`, [book_id]);
        await promiseQuery(`DELETE FROM Coedit WHERE RecipeBookId = ? AND UserId = ?`, [book_id, username]);
        return res.json({ ok: true, message: 'Book deleted (owner).' });
      } else {
        await promiseQuery(`DELETE FROM Coedit WHERE RecipeBookId = ? AND UserId = ?`, [book_id, username]);
        await promiseQuery(`DELETE FROM ReadOnly WHERE RecipeBookId = ? AND UserId = ?`, [book_id, username]);
        return res.json({ ok: true, message: 'Access removed (coedit/read-only).' });
      }
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  };

  const changeRecipeBookName = async (req, res) => {
    console.log('changeRecipeBookName called');
    const { book_id, new_book_name } = req.body;
  
    if (!book_id || new_book_name === undefined) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }
  
    const result =
     await promiseQuery(
      `UPDATE RecipeBooks SET Name = ? WHERE RecipeBookId = ?`, [new_book_name, book_id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ ok: false, error: 'Recipe book not found' });
      }
  
      console.log(`Recipe book ID ${book_id} renamed to '${new_book_name}'`);
      res.json({ ok: true });
    };
  
const inviteReadOnly = async (req, res) => {
      const { username, invited_username, book_id } = req.body;
      if (!username || !invited_username || !book_id) return res.status(400).json({ ok: false, error: 'Missing required fields' });
      try {
        const users = await promiseQuery(`SELECT * FROM Users WHERE UserId = ?`, [invited_username]);
        if (users.length === 0) return res.status(404).json({ ok: false, error: 'Invited user does not exist' });
        await promiseQuery(`INSERT INTO ReadOnly (UserId, RecipeBookId) VALUES (?, ?)`, [invited_username, book_id]);
        res.json({ ok: true });
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: 'User already has read-only access' });
        res.status(500).json({ ok: false, error: err.message });
      }
    };
  
const inviteCoedit = async (req, res) => {
      const { username, invited_username, book_id } = req.body;
      if (!username || !invited_username || !book_id) return res.status(400).json({ ok: false, error: 'Missing required fields' });
      try {
        const users = await promiseQuery(`SELECT * FROM Users WHERE UserId = ?`, [invited_username]);
        if (users.length === 0) return res.status(404).json({ ok: false, error: 'Invited user does not exist' });
        await promiseQuery(`INSERT INTO Coedit (UserId, RecipeBookId) VALUES (?, ?)`, [invited_username, book_id]);
        res.json({ ok: true });
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ ok: false, error: 'User already has co-edit access' });
        res.status(500).json({ ok: false, error: err.message });
      }
    };
    
const getRecipeBookContent = async (req, res) => {
      const { username, book_id } = req.query;
      console.log('getRecipeBookContent called:', username, book_id);
      if (!username || !book_id) {
        return res.status(400).json({ error: 'username and book_id are required' });
      }
    
      try {
        const [[ownerRow], coeditRows, readonlyRows] = await Promise.all([
          promiseQuery(`SELECT OwnerId AS owner FROM RecipeBooks WHERE RecipeBookId = ?`, [book_id]),
          promiseQuery(`SELECT UserId FROM Coedit WHERE RecipeBookId = ?`, [book_id]),
          promiseQuery(`SELECT UserId FROM ReadOnly WHERE RecipeBookId = ?`, [book_id])
        ]);
    
        if (!ownerRow) return res.status(404).json({ error: 'Recipe book not found' });
    
        const owner = ownerRow.owner;
        const coeditors = coeditRows.map(r => r.UserId);
        const readonlys = readonlyRows.map(r => r.UserId);
    
        let access_to_it = null;
        if (username === owner) access_to_it = 'owner';
        else if (coeditors.includes(username)) access_to_it = 'coedit';
        else if (readonlys.includes(username)) access_to_it = 'read_only';
        else return res.status(403).json({ error: 'Access denied to this recipe book' });
    
        const recipeRows = await promiseQuery(
          `SELECT RecipeId FROM RecipesInRecipeBooks WHERE RecipeBookId = ?`,
          [book_id]
        );
    
        const list_of_recipe_id = recipeRows.map(r => r.RecipeId);
        const displayStr = `Owner: ${owner}` +
          `; Coeditor: ${coeditors.join(', ') || 'None'}` +
          `; Read only visitor: ${readonlys.join(', ') || 'None'}`;
    
        return res.json({
          relationships_display: displayStr,
          list_of_recipe_id,
          access_to_it
        });
    
      } catch (err) {
        console.error('getRecipeBookContent error:', err);
        return res.status(500).json({ error: err.message });
      }
    };
  
  export {
    getAllRecipeBooks,
    postRecipeBook,
    deleteRecipeBook,
    getRecipeBookContent,
    changeRecipeBookName,
    inviteReadOnly,
    inviteCoedit,
  };
  