// TODO: replace recipebooks with @api calls
export type Recipe = {
    id: number;
    name: string;
};

// Define the recipeBooks array at the top so all functions can access it
let recipeBooks: Recipe[] = [
    { id: 1, name: 'Spaghetti Carbonara' },
    { id: 2, name: 'Chicken Alfredo' },
];

// Fetch all recipe books
export async function getRecipeBookList(): Promise<Recipe[]> {
    return recipeBooks;
}

// Add a new recipe book
export async function addRecipeBook(name: string): Promise<Recipe> {
    const newRecipe = { id: Date.now(), name };
    recipeBooks.push(newRecipe);
    return newRecipe;
}

// Delete a recipe book by ID
export async function deleteRecipeBook(recipeId: number): Promise<void> {
    recipeBooks = recipeBooks.filter(recipe => recipe.id !== recipeId);
}