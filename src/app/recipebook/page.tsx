'use client';

import { useState } from 'react';

export default function RecipeBookListEditor() {
  // Editable header for the Recipe Book List section
  const [isEditingBookListName, setIsEditingBookListName] = useState(false);
  const [bookListName, setBookListName] = useState('My Recipe Book List');

  // Editable header for the Recipe section
  const [isEditingRecipeName, setIsEditingRecipeName] = useState(false);
  const [recipeName, setRecipeName] = useState('My Recipes');

  // Dummy data for lists;
  const [recipeBooks, setRecipeBooks] = useState([
    { id: 1, name: 'Recipe Book 1' },
    { id: 2, name: 'Recipe Book 2' },
  ]);
  const [recipes, setRecipes] = useState([
    { id: 1, name: 'Recipe 1' },
    { id: 2, name: 'Recipe 2' },
  ]);

  // Handlers for Recipe Book List header editing
  const handleSaveBookListName = () => {
    // Optionally, persist the new name to your backend here.
    setIsEditingBookListName(false);
  };

  const handleCancelBookListName = () => {
    // Optionally, revert changes if needed.
    setIsEditingBookListName(false);
  };

  // Handlers for Recipe header editing
  const handleSaveRecipeName = () => {
    // Optionally, persist the new name to your backend here.
    setIsEditingRecipeName(false);
  };

  const handleCancelRecipeName = () => {
    // Optionally, revert changes if needed.
    setIsEditingRecipeName(false);
  };

  return (
    <div className="p-6">
      {/* Section for Recipe Book List */}
      <div className="mb-8">
        {isEditingBookListName ? (
          <div>
            <input
              type="text"
              value={bookListName}
              onChange={(e) => setBookListName(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <button
              onClick={handleSaveBookListName}
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancelBookListName}
              className="ml-2 bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{bookListName}</h1>
            <button
              onClick={() => setIsEditingBookListName(true)}
              className="ml-4 text-blue-500 underline"
            >
              (Click for Edit)
            </button>
          </div>
        )}

        <ul className="mt-4">
          {recipeBooks.map((book) => (
            <li key={book.id} className="py-1">
              {book.name}
            </li>
          ))}
        </ul>
      </div>

      <hr className="my-8" />

      {/* Section for Recipes */}
      <div>
        {isEditingRecipeName ? (
          <div>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <button
              onClick={handleSaveRecipeName}
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancelRecipeName}
              className="ml-2 bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{recipeName}</h1>
            <button
              onClick={() => setIsEditingRecipeName(true)}
              className="ml-4 text-blue-500 underline"
            >
              (Click for Edit)
            </button>
          </div>
        )}

        <ul className="mt-4">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="py-1">
              {recipe.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
