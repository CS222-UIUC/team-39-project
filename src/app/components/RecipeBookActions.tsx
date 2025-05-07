'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getRecipeBookList, addRecipeBook, deleteRecipeBook, getAccessDetails } from '@/app/lib/recipes';
import ReactiveButton from 'reactive-button';
import { logout } from '@/app/actions/auth'

// Define a type for Recipe
type RecipeBook = {
    id: number;
    displayName: string;
    access: 'owner' | 'coedit' | 'read_only';
};

// Define props for RecipeBookActions component
interface RecipeBookActionsProps {
    username: string;
}


export default function RecipeBookActions({ username }: RecipeBookActionsProps) {
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
            alert('Error fetching access for a book. Contact support at hereiszory@gmail.com');
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
          alert('Error adding recipe book. Contact support at hereiszory@gmail.com');
          return;
        }
    
        await addRecipeBook(username, newRecipeBookName);
        await loadBooks();
        setNewRecipeBookName('');
    };

    const handleDeleteRecipeBook = async (bookId: number) => {
        if (!username) {
          console.error('Username not found');
          alert('Error deleting recipe book. Contact support at hereiszory@gmail.com');
          return;
        }
    
        await deleteRecipeBook(username, bookId);
        await loadBooks();
    };

    return (
        <div className="p-6 text-black">
            <div className="w-full flex">
                <h1 className="mx-1 my-1 flex-1 text-lg">Welcome back, {username}!</h1>
                <form action={logout} className="ml-4 flex-none">
                    <ReactiveButton
                        type="submit"
                        color="violet"
                        idleText="Logout"
                        className="text-white rounded"
                    />
                </form>
            </div>
            
            <h2 className="text-2xl font-bold m-1 my-2">Your Recipe Books</h2>
        
            <div className="flex items-center gap-2 m-1 my-2 mb-6 w-full">
                <input
                    type="text"
                    className="text-black px-2 py-1 rounded border flex-1"
                    value={newRecipeBookName}
                    onChange={(e) => setNewRecipeBookName(e.target.value)}
                    placeholder="New recipe book name"
                />
                <ReactiveButton
                    onClick={handleAddRecipeBook}
                    color="violet"
                    idleText="Add Recipe Book"
                    className="text-white rounded flex-none"
                />
            </div>
        
            <ul className="list-disc pl-1 space-y-5">
                {recipeBooks.map((book) => (
                    <li key={book.id} className="flex items-center gap-2">
                        <Link href={`/book/${book.id}`} className="text-blue-400 hover:underline flex-1">
                            {book.displayName}
                        </Link>

                        {/* Only show delete button if owner */}
                        {book.access === 'owner' && (
                            <ReactiveButton
                                onClick={() => handleDeleteRecipeBook(book.id)}
                                color="red"
                                idleText="Delete"
                                size="small"
                                className="text-white rounded flex-none"
                            />
                        )}
                        
                        {(book.access === 'coedit' || book.access === 'read_only') && (
                            <ReactiveButton
                                onClick={() => handleDeleteRecipeBook(book.id)}
                                color="red"
                                idleText="Remove Access"
                                size="small"
                                className="text-white rounded flex-none"
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
