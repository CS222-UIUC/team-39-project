'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateRecipeBook } from '@/app/lib/recipes';
import ReactiveButton from 'reactive-button';

interface Props {
  username: string;
  bookId: number;
}

export default function ClientBookPage({ username, bookId }: Props) {
    const router = useRouter();
    // todo: decode the name of the book by calling getRecipeBook
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
  
        await updateRecipeBook(bookId, editedBookName.trim());
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

            <ReactiveButton 
                onClick={handleTitleSave}
                color="violet" 
                idleText="Save" 
                style={{
                    margin: "5px",
                    width: "50%", // Occupy half width
                }}
            />
            <ReactiveButton 
                onClick={handleTitleCancel}
                color="violet" 
                idleText="Cancel" 
                style={{
                    margin: "5px",
                    width: "50%", // Occupy half width
                }}
            />
            {/* className="bg-gray-500 px-3 py-1 rounded text-white" */}
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
          <ReactiveButton onClick={addFood} color="violet" idleText="+ Add Recipe" className="bg-green-500 px-3 py-1 rounded text-white"/>
        </div>
  
        <ul>
          {foods.map((food) => (
            <li key={food.id}>
              <Link href={`/book/${bookId}/${food.id}`} className="text-blue-400 hover:underline">
                {food.id}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  