'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactiveButton from 'reactive-button';
import { getRecipeBookContent, getBookNameById, updateRecipeBook, addRecipe, deleteRecipe, getRecipe } from '@/app/lib/recipes';
import { inviteReadOnly, inviteCoedit } from '@/app/lib/recipes'; // import them!

interface Recipe {
  name: string;
  id: number; // recipe book id
}

export default function ClientBookPage({ id, username }: { id: number; username: string }) {
    const router = useRouter();
    const { bookId } = useParams();
    const [bookName, setBookName] = useState('');
    const [isEditingBookName, setIsEditingBookName] = useState(false);
    const [editedBookName, setEditedBookName] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [newRecipeName, setNewRecipeName] = useState('');
    const [access, setAccess] = useState<'owner' | 'coedit' | 'read_only'>('read_only');
    const [inviteMode, setInviteMode] = useState(false);
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteRole, setInviteRole] = useState<'read_only' | 'coedit'>('coedit');
    

    const [relationships, setRelationships] = useState('');
  
    const loadBookData = useCallback(async () => {
      if (!bookId || typeof bookId !== 'string') return;
    
      try {
        const id = parseInt(bookId); // id is BookID
        const content = await getRecipeBookContent(username, id);
        setRelationships(content.relationships_display);
        setAccess(content.access_to_it);
    
        const bookName = await getBookNameById(username, id);
        setBookName(bookName);
    
        const fetchedRecipes = await Promise.all(
          content.recipe_ids.map(async (recipeId: number) => {
            const recipe = await getRecipe(recipeId);
            return { id: recipe.id, name: recipe.name };
          })
        );
        setRecipes(fetchedRecipes);
    
      } catch (error) {
        console.error('Error loading book data:', error);
      }
    }, [bookId, username]);
  
    useEffect(() => {
      loadBookData();
    }, [loadBookData]);

    const handleSaveBookName = async () => {
      try {
        if (bookId && typeof bookId === 'string') {
          await updateRecipeBook(parseInt(bookId), editedBookName);
        } else {
          console.error('Invalid bookId:', bookId);
        }
        setBookName(editedBookName);  // update UI
        setIsEditingBookName(false);  // exit editing mode
      } catch (error) {
        console.error('Error updating book name:', error);
      }
    };

    const handleAddRecipe = async () => {
      if (!newRecipeName.trim() || !bookId || typeof bookId !== 'string') return;
      await addRecipe(parseInt(bookId), newRecipeName);
      await loadBookData();
      setNewRecipeName('');
    };
  
    const handleDeleteRecipe = async (recipeId: number) => {
      if (!bookId || typeof bookId !== 'string') return;
      await deleteRecipe(parseInt(bookId), recipeId);
      await loadBookData();
    };
  
    const handleInviteButtonClick = () => {
      setInviteMode(true);
    };

    const handleSendInvite = async () => {
      if (!inviteUsername.trim()) {
        alert('Please enter a username to invite.');
        return;
      }

      try {
        if (inviteRole === 'read_only') {
          await inviteReadOnly(username, inviteUsername.trim(), id);
        } else {
          await inviteCoedit(username, inviteUsername.trim(), id);
        }
        alert('Invitation sent successfully!');
        setInviteMode(false);
        setInviteUsername('');
      } catch (error: any) {
        alert(`Failed to invite: ${error.message}`);
      }
    };

    const handleCancelInvite = () => {
      setInviteMode(false);
      setInviteUsername('');
    };
    return (
    <div className="p-6 text-black">
        <button
            onClick={() => router.push('/')}
            className="text-blue-500 hover:underline mb-6 text-lg"
        >
            ← Back to All Recipe Books
        </button>

        {/* Editable book name section */}
        <div className="flex items-center gap-2 mb-4 w-full">
        {isEditingBookName ? (
            <>
            <input
                type="text"
                className="text-sm text-black px-2 py-1 rounded border flex-1 text-center"
                value={editedBookName}
                onChange={(e) => setEditedBookName(e.target.value)}
            />
            <ReactiveButton 
                onClick={handleSaveBookName}
                color="violet" 
                className="rounded text-white flex-none"
                idleText="Save" 
            />
            <ReactiveButton 
                onClick={() => setIsEditingBookName(false)}
                color="red" 
                className="rounded text-white flex-none"
                idleText="Cancel" 
            />
            </>
        ) : (
            <>
            <h1 className="text-3xl font-bold flex-1 text-center">{bookName}</h1>
            {access === 'owner' && (
                <ReactiveButton 
                    onClick={() => {
                        setEditedBookName(bookName);
                        setIsEditingBookName(true);
                    }}
                    color="violet" 
                    className="rounded text-white flex-none"
                    idleText="Rename" 
                />
            )}
            </>
        )}
        </div>

        <div className="my-1 flex">  
            <h2 className="p-1 text-center flex-1">{relationships}</h2>

            {/* Invitation UI */}
            {access === 'owner' && (
            <div className="flex items-center gap-2 mb-6 flex-none">
            {!inviteMode ? (
                <ReactiveButton 
                    onClick={handleInviteButtonClick}
                    color="violet" 
                    className="rounded text-white"
                    idleText="Invite Users" 
                />
            ) : (
                <div className="flex flex-col md:flex-row items-center gap-2 ">
                    <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'read_only' | 'coedit')}
                        className="border px-2 py-1 rounded text-black"
                    >
                        <option value="read_only">Read Only</option>
                        <option value="coedit">Co-Editor</option>
                    </select>
                    <input
                        type="text"
                        value={inviteUsername}
                        onChange={(e) => setInviteUsername(e.target.value)}
                        placeholder="Enter username"
                        className="border px-2 py-1 rounded text-black flex-1"
                    />
                    <ReactiveButton
                        onClick={handleSendInvite}
                        color="violet"
                        className="rounded text-white"
                        idleText="Invite"
                    />
                    <ReactiveButton
                        onClick={handleCancelInvite}
                        color="red"
                        className="rounded text-white"
                        idleText="Cancel"
                    />
                </div>
            )}
            </div>
            )}
        </div>

        {/* Add/Delete recipes */}
        {(access === 'owner' || access === 'coedit') && (
        <div className="flex items-center gap-2 mb-6 w-full">
            <input
                type="text"
                className="text-black px-2 py-1 rounded border flex-1"
                value={newRecipeName}
                onChange={(e) => setNewRecipeName(e.target.value)}
                placeholder="New recipe name"
            />
            <ReactiveButton
                onClick={handleAddRecipe}
                color="violet"
                idleText="+ Add Recipe"
                className="bg-green-500 px-3 py-1 rounded text-white flex-none"
            />
        </div>
        )}

        <ul className="list-disc pl-5 space-y-5">
        {recipes.map((recipe) => (
            <li key={recipe.id} className="flex items-center gap-2">
                <Link href={`/book/${bookId}/${recipe.id}`} className="text-blue-400 hover:underline flex-1">
                    {recipe.name}
                </Link>

                {(access === 'owner' || access === 'coedit') && (
                    <ReactiveButton
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        color="red"
                        size="small"
                        idleText="Delete"
                        className="text-white px-2 py-1 rounded flex-none"
                    />
                )}
            </li>
        ))}
        </ul>
    </div>
    );
}