// user interaction in login page, so we need a client to handle it
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getRecipeBookList, addRecipeBook, deleteRecipeBook, getAccessDetails } from '@/app/lib/recipes';

// Define a type for Recipe
type RecipeBook = {
    id: number;
    displayName: string;
    access: 'owner' | 'coedit' | 'read_only';
};

// Define props for RecipeBookActions component
interface RecipeBookActionsProps {
    initialRecipeBooks: { id: number; name: string }[];
    username: string;
}


export default function RecipeBookActions({ initialRecipeBooks, username }: RecipeBookActionsProps) {
    const [recipeBooks, setRecipeBooks] = useState<RecipeBook[]>([]);
    const [newRecipeBookName, setNewRecipeBookName] = useState('');

    const loadBooks = useCallback(async () => {
      if (!username) return;
    
      const books = await getRecipeBookList(username);
    
      const booksWithAccess = await Promise.all(
        books.map(async (book) => {
          try {
            const accessInfo = await getAccessDetails(username, book.id);
            return {
              ...book,
              access: accessInfo.access_to_it as 'owner' | 'coedit' | 'read_only',
            };
          } catch (error) {
            console.error('Error fetching access for book:', book.id, error);
            return {
              ...book,
              access: 'read_only', // fallback
            };
          }
        })
      );
    
      setRecipeBooks(booksWithAccess);
    }, [username]);

    useEffect(() => {
      loadBooks();
    }, [loadBooks]);    

    const handleAddRecipeBook = async () => {
        if (!newRecipeBookName.trim()) return;
        if (!username) {
          console.error('Username not found');
          return;
        }
    
        await addRecipeBook(username, newRecipeBookName);
        await loadBooks();
        setNewRecipeBookName('');
    };

    const handleDeleteRecipeBook = async (bookId: number) => {
        if (!username) {
          console.error('Username not found');
          return;
        }
    
        await deleteRecipeBook(username, bookId);
        await loadBooks();
    };

    return (
        <div className="p-6 text-black">
          <h2 className="text-2xl font-bold mb-4">Your Recipe Book List</h2>
    
          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              className="text-black px-2 py-1 rounded border"
              value={newRecipeBookName}
              onChange={(e) => setNewRecipeBookName(e.target.value)}
              placeholder="New recipe book name"
            />
            <button
              onClick={handleAddRecipeBook}
              className="bg-green-500 px-4 py-1 rounded text-white"
            >
              Add Recipe Book
            </button>
          </div>
    
          <ul className="list-disc pl-5 space-y-2">
            {recipeBooks.map((book) => (
                <li key={book.id} className="flex items-center gap-2">
                <Link href={`/book/${book.id}`} className="text-blue-400 hover:underline">
                    {book.displayName}
                </Link>

                {/* Only show delete button if owner */}
                {book.access === 'owner' && (
                    <button
                    onClick={() => handleDeleteRecipeBook(book.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                    Delete
                    </button>
                )}
                {(book.access === 'coedit' || book.access === 'read_only') && (
                  <button
                    onClick={() => handleDeleteRecipeBook(book.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Remove Access
                  </button>
                )}

                </li>
            ))}
            </ul>
        </div>
    );
}
