'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateRecipeBook } from '@/app/lib/recipes';

interface Props {
  username: string;
  bookId: string;
}

export default function ClientBookPage({ username, bookId }: Props) {
    const router = useRouter();
    const readableBookName = decodeURIComponent(bookId.replaceAll('-', ' ')).trim();
  
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedBookName, setEditedBookName] = useState(readableBookName);
  
    const [foods, setFoods] = useState<{ id: string; name: string }[]>([]);
    const [newFoodName, setNewFoodName] = useState('');
  
    const addFood = () => {
      if (!newFoodName.trim()) return;
  
      const newFood = {
        id: `food-${Date.now()}`,
        name: newFoodName.trim(),
      };
  
      setFoods([...foods, newFood]);
      setNewFoodName('');
    };
  
    const handleTitleSave = async () => {
      try {
        if (editedBookName === readableBookName) {
          setIsEditingTitle(false);
          return;
        }
  
        await updateRecipeBook(username, readableBookName, editedBookName.trim());
        setIsEditingTitle(false);
        router.push(`/book/${editedBookName.replaceAll(' ', '-')}`);
      } catch (err) {
        console.error('Failed to update recipe book title:', err);
      }
    };
  
    const handleTitleCancel = () => {
      setEditedBookName(readableBookName);
      setIsEditingTitle(false);
    };
  
    return (
      <div className="p-3 text-black">
        {isEditingTitle ? (
          <div className="flex items-center gap-2 mb-4">
            <input
              className="text-black px-2 py-1 rounded"
              value={editedBookName}
              onChange={(e) => setEditedBookName(e.target.value)}
            />
            <button onClick={handleTitleSave} className="bg-blue-500 px-3 py-1 rounded text-white">Save</button>
            <button onClick={handleTitleCancel} className="bg-gray-500 px-3 py-1 rounded text-white">Cancel</button>
          </div>
        ) : (
          <h1 className="text-2xl font-bold mb-4 cursor-pointer" onClick={() => setIsEditingTitle(true)}>
            {editedBookName}
          </h1>
        )}
  
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            className="text-black px-2 py-1 rounded"
            placeholder="Enter new food name"
            value={newFoodName}
            onChange={(e) => setNewFoodName(e.target.value)}
          />
          <button onClick={addFood} className="bg-green-500 px-3 py-1 rounded text-white">
            + Add Food
          </button>
        </div>
  
        <ul>
          {foods.map((food) => (
            <li key={food.id}>
              <Link href={`/book/${bookId}/${food.id}`} className="text-blue-400 hover:underline">
                {food.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  