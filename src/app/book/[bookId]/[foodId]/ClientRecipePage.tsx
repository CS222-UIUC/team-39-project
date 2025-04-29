'use client';

import { useState, useEffect } from 'react';
import { getRecipe, updateRecipe, getAccessDetails } from '@/app/lib/recipes';
import { uploadImage } from '@/app/actions/upload';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

interface ClientRecipePageProps {
  username: string;
  bookId: string;
  foodId: string;
}

export default function ClientRecipePage({ username, bookId, foodId }: ClientRecipePageProps) {
  const [recipeName, setRecipeName] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [preview, setPreview] = useState<'edit' | 'preview'>('preview');
  const [access, setAccess] = useState<'owner' | 'coedit' | 'read_only'>('read_only');

  useEffect(() => {
    const loadData = async () => {
      const recipe = await getRecipe(parseInt(foodId));
      setRecipeName(recipe.name);
      setRecipeCategory(recipe.category);
      setIngredients(recipe.ingredients);
      setSteps(recipe.steps);

      const accessInfo = await getAccessDetails(username, parseInt(bookId));
      setAccess(accessInfo.access_to_it);
      console.log('Access:', accessInfo.access_to_it);
    };

    loadData();
  }, [bookId, foodId, username]);

  // Auto-save when editing
    useEffect(() => {
      console.log('[DEBUG] Auto-save triggered', {
        preview, access,
        recipeName, recipeCategory, ingredients, steps
      });
      if (preview !== 'edit' || (access !== 'owner' && access !== 'coedit')) return;
      const debounce = setTimeout(() => {
        const safeIngredients = ingredients ?? ''; 
        const safeSteps = steps ?? '';
        updateRecipe(parseInt(foodId), recipeName, recipeCategory, safeIngredients, safeSteps)
            .then(() => console.log('Auto-saved'))
            .catch((err) => console.error('Auto-save failed', err));
      }, 500);
      return () => clearTimeout(debounce);
    }, [recipeName, recipeCategory, ingredients, steps, preview, access]);

  return (
    <div className="p-6 text-black">
      {/* change recipe name */}
      {preview === 'edit' && (access === 'owner' || access === 'coedit') ? (
        <input
            type="text"
            className="text-3xl font-bold mb-4 w-full p-2 border rounded"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="Recipe Name"
        />
        ) : (
        <h1 className="text-3xl font-bold mb-4">{recipeName}</h1>
        )}
      {access !== 'read_only' && (
        <button
          onClick={() => setPreview(preview === 'edit' ? 'preview' : 'edit')}
          className="bg-green-500 px-4 py-2 rounded text-white mb-6"
        >
          Switch to {preview === 'edit' ? 'Preview' : 'Edit'} Mode
        </button>
      )}

        {preview === 'edit' && (access === 'owner' || access === 'coedit') ? (
        <div className="mb-4">
            <label className="block font-bold mb-1">Category:</label>
            <select
            value={recipeCategory}
            onChange={(e) => setRecipeCategory(e.target.value)}
            className="p-2 border rounded w-full"
            >
            <option value="Uncategorized">Uncategorized</option>
            <option value="Appetizers">Appetizers</option>
            <option value="Main Course">Main Course</option>
            <option value="Desserts">Desserts</option>
            <option value="Snacks">Snacks</option>
            <option value="Drinks">Drinks</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Soups">Soups</option>
            <option value="Others">Others</option>
            </select>
        </div>
        ) : (
        <h2 className="text-xl font-bold mb-2">Category: {recipeCategory}</h2>
        )}

      <h2 className="text-xl font-bold mb-2">Ingredients:</h2>
      <MDEditor
        value={ingredients}
        onChange={(value) => setIngredients(value || '')}
        preview={preview}
        previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        textareaProps={{ placeholder: "Input ingredients here..." }}
      />

      <h2 className="text-xl font-bold mb-2 mt-6">Steps:</h2>
      <MDEditor
        value={steps}
        onChange={(value) => setSteps(value || '')}
        preview={preview}
        previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        textareaProps={{ placeholder: "Input steps here..." }}
      />
    </div>
  );
}