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
    const [newRecipeBookName, setNewRecipeBookName] = useState('');

    const handleAddRecipeBook = async () => {
        if (!newRecipeBookName.trim()) return;
        const newRecipe = await addRecipeBook(newRecipeBookName);
        setRecipeBooks([...recipeBooks, newRecipe]);
        setNewRecipeBookName('');
    };

    const handleDeleteRecipeBook = async (recipeId: number) => {
        await deleteRecipeBook(recipeId);
        setRecipeBooks(recipeBooks.filter(recipe => recipe.id !== recipeId));
    };

    return (
        <div>
            <h2>Your Recipe Book List</h2>
            <input 
                type="text" 
                value={newRecipeBookName} 
                onChange={(e) => setNewRecipeBookName(e.target.value)}
                placeholder="New recipe book name"
            />
            <button onClick={handleAddRecipeBook}>Add Recipe Book</button>
            <ul>
                {recipeBooks.map(recipe => (
                    <li key={recipe.id}>
                        <Link href={`/book/${recipe.name.replaceAll(' ', '-')}`}>{recipe.name}</Link>
                        <button onClick={() => handleDeleteRecipeBook(recipe.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
