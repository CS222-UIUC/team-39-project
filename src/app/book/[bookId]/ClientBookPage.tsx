'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactiveButton from 'reactive-button';
import { getRecipeBookContent, getBookNameById, updateRecipeBook, addRecipe, deleteRecipe, getRecipe } from '@/app/lib/recipes';
import { inviteReadOnly, inviteCoedit } from '@/app/lib/recipes'; // import them!

interface Recipe {
  name: string;
  id: number; // recipe book id
}

export default function ClientBookPage({ id, username }: { id: number; username: string }) {
    const { bookId } = useParams();
    const [bookName, setBookName] = useState('');
    const [isEditingBookName, setIsEditingBookName] = useState(false);
    const [editedBookName, setEditedBookName] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [newRecipeName, setNewRecipeName] = useState('');
    const [access, setAccess] = useState<'owner' | 'coedit' | 'read_only'>('read_only');
    const [inviteMode, setInviteMode] = useState(false);
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteRole, setInviteRole] = useState<'read_only' | 'coedit'>('read_only');
    

    const [relationships, setRelationships] = useState('');
  
    const loadBookData = async () => {
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
            const recipe = await getRecipe(recipeId);  // recipeId, not bookId
            return { id: recipe.id, name: recipe.name };
          })
        );
        setRecipes(fetchedRecipes);
    
      } catch (error) {
        console.error('Error loading book data:', error);
      }
    };
  
    useEffect(() => {
      loadBookData();
    }, [bookId]);

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
      const confirmInvite = confirm('Are you sure you want to invite someone to this recipe book?');
      if (confirmInvite) {
        setInviteMode(true);
      }
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
      // only owner of the book can edit the name
      <div className="p-6 text-black">
        <div className="flex items-center gap-2 mb-4">
        {isEditingBookName ? (
          <>
            <input
              type="text"
              className="text-black px-2 py-1 rounded border"
              value={editedBookName}
              onChange={(e) => setEditedBookName(e.target.value)}
            />

            <ReactiveButton 
                onClick={handleSaveBookName}
                color="violet" 
                idleText="Save" 
                style={{
                    margin: "5px",
                    width: "100%",
                }}
            />
            <ReactiveButton 
                onClick={() => setIsEditingBookName(false)}
                color="violet" 
                idleText="Cancel" 
                style={{
                    margin: "5px",
                    width: "100%",
                }}
            />
            {/* className="bg-gray-500 px-3 py-1 rounded text-white" */}
          </>
        ) : (
          <>
          {/* owner can edit book name */}
          <h1 className="text-3xl font-bold">{bookName}</h1>

            {access === 'owner' && (
              <button
                onClick={() => {
                  setEditedBookName(bookName);
                  setIsEditingBookName(true);
                }}
                className="bg-green-500 px-4 py-1 rounded text-white"
              >
                Change Name
              </button>
            )}
          </>
        )}
      </div>
        <p className="mb-4">{relationships}</p>
        {access === 'owner' && (
        <div className="my-6">
          {/* owner can invite other people */}
          {!inviteMode ? (
            <button
              onClick={handleInviteButtonClick}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Invite Other User
            </button>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-2">
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
                placeholder="Enter username to invite"
                className="border px-2 py-1 rounded text-black"
              />
              <button
                onClick={handleSendInvite}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Confirm Invite
              </button>
              <button
                onClick={handleCancelInvite}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      {/* owner and coeditor can add, delete recipes */}
        {(access === 'owner' || access === 'coedit') && (
          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              className="text-black px-2 py-1 rounded border"
              value={newRecipeName}
              onChange={(e) => setNewRecipeName(e.target.value)}
              placeholder="New recipe name"
            />
            <ReactiveButton onClick={handleAddRecipe} color="violet" idleText="+ Add Recipe" className="bg-green-500 px-3 py-1 rounded text-white"/>
          </div>
        )}
        <ul className="list-disc pl-5 space-y-2">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="flex items-center gap-2">
              <Link href={`/book/${bookId}/${recipe.id}`} className="text-blue-400 hover:underline">
                {recipe.name}
              </Link>
  
              {(access === 'owner' || access === 'coedit') && (
                <button
                  onClick={() => handleDeleteRecipe(recipe.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
}
  