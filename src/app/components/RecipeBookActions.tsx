// user interaction in login page, so we need a client to handle it
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addRecipeBook, deleteRecipeBook } from '@/app/lib/recipes';

// Define a type for Recipe
type Recipe = {
    id: number;
    name: string;
};

// Define props for RecipeBookActions component
interface RecipeBookActionsProps {
    initialRecipeBooks: Recipe[];
}

export default function RecipeBookActions({ initialRecipeBooks }: RecipeBookActionsProps) {
    const [recipeBooks, setRecipeBooks] = useState<Recipe[]>(initialRecipeBooks);
    const [newRecipeName, setNewRecipeName] = useState('');

    const handleAddRecipe = async () => {
        if (!newRecipeName.trim()) return;
        const newRecipe = await addRecipeBook(newRecipeName);
        setRecipeBooks([...recipeBooks, newRecipe]);
        setNewRecipeName('');
    };

    const handleDeleteRecipe = async (recipeId: number) => {
        await deleteRecipeBook(recipeId);
        setRecipeBooks(recipeBooks.filter(recipe => recipe.id !== recipeId));
    };

    return (
        <div>
            <h2>Your Recipe Book List</h2>
            <input 
                type="text" 
                value={newRecipeName} 
                onChange={(e) => setNewRecipeName(e.target.value)}
                placeholder="New recipe book name"
            />
            <button onClick={handleAddRecipe}>Add Recipe Book</button>
            <ul>
                {recipeBooks.map(recipe => (
                    <li key={recipe.id}>
                        <Link href={`/book/${recipe.id}`}>{recipe.name}</Link>
                        <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
