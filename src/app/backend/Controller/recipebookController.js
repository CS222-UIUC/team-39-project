const connection = require('../Database/connection');

// Get all recipeBooks
const getAllRecipeBooks = (req, res) => {
    console.log('getAllRecipeBooks called');
    const query = "SELECT * FROM RecipeBooks ORDER BY Name ASC";
    connection.query(query, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(rows);
    });
  };
  
  // Get a single recipeBook
  const getRecipeBookById = (req, res) => {
    console.log('getRecipeBookById called');
    const recipeBookId = req.params.id;
    const query = "SELECT * FROM RecipeBooks WHERE RecipeBookId = ? ORDER BY Name ASC";
    connection.query(query, [recipeBookId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (rows.length === 0) {
            return res.status(404).json({ msg: "RecipeBook not found" });
        }
        res.json(rows[0]);
    });
  };
  
  // Post a new recipeBook
  const postRecipeBook = (req, res) => {
    console.log('postRecipeBook called');
    const { userId, name} = req.body;

    if (!userId || !name) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    //Id should be handled by sql auto-increment
    const query = "INSERT INTO RecipeBooks (Name) VALUES (?)";
    connection.query(query, [name], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        
        const recipeBookId = result.insertId; //Id should be handled by sql auto-increment
        const favQuery = "INSERT INTO FavRecipeBooks (UserId, RecipeBookId) VALUES (?, ?)";
        connection.query(favQuery, [userId, recipeBookId], (favErr, favResult) => {
            if (favErr) {
                return res.status(500).json({ error: favErr });
            }
            res.status(201).json({ msg: "RecipeBook added", recipeBookId });
        });
    });
};
  
  // Delete a recipeBook
  const deleteRecipeBook = (req, res) => {
    console.log('deleteRecipeBook called');
    const { id } = req.params;
    const query = "DELETE FROM RecipeBooks WHERE RecipeBookId = ?";
    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "RecipeBook not found" });
        }
        res.json({ msg: `RecipeBook with id ${id} deleted` });
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
    getRecipeBookById,
    postRecipeBook,
    deleteRecipeBook,
    updateRecipeBook,
  };
  