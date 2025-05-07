import promiseQuery from '../Utils/promiseQuery.js';



const postRecipe = async (req, res) => {
  const { book_id, recipe_name } = req.body;
  console.log('postRecipe called', book_id, recipe_name);
  if (!book_id || recipe_name === undefined) {
    return res.status(400).json({ error: 'Missing field' });
  }
  try {
    const insertResult = await promiseQuery('INSERT INTO Recipes (Name, Category) VALUES (?, ?)', [recipe_name, 'Uncategorized']);
    const newRecipeId = insertResult.insertId;
    await promiseQuery('INSERT INTO RecipesInRecipeBooks (RecipeId, RecipeBookId) VALUES (?, ?)', [newRecipeId, book_id]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

  
const deleteRecipe = async (req, res) => {
  const { recipe_id } = req.body;
  if (!recipe_id) return res.status(400).json({ error: 'Missing recipe_id' });

  try {
    await promiseQuery('DELETE FROM Recipes WHERE RecipeId = ?', [recipe_id]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



const getOneRecipe = async (req, res) => {
  const { recipe_id } = req.query;
  if (!recipe_id) return res.status(400).json({ error: 'Missing recipe_id' });
  try {
    const results = await promiseQuery('SELECT * FROM Recipes WHERE RecipeId = ?', [recipe_id]);
    if (results.length === 0) return res.status(404).json({ error: 'Recipe not found' });
    const recipe = results[0];
    res.status(200).json({
      recipe_name: recipe.Name,
      recipe_category: recipe.Category,
      recipe_ingredients: recipe.Ingredients,
      recipe_steps: recipe.Steps
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateRecipe = async (req, res) => {
  const { recipe_id, recipe_name, recipe_category, recipe_ingredients, recipe_steps } = req.body;
  if (!recipe_id || recipe_name === undefined || !recipe_category) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const updateQuery = `
    UPDATE Recipes
    SET Name = ?, Category = ?, Ingredients = ?, Steps = ?
    WHERE RecipeId = ?
  `;
  try {
    await promiseQuery(updateQuery, [recipe_name, recipe_category, recipe_ingredients, recipe_steps, recipe_id]);
    res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
  

export {
   updateRecipe, 
   getOneRecipe, 
   //getRecipeList,
   deleteRecipe,
   postRecipe
  };