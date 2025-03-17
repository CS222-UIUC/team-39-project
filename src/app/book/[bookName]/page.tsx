// from https://nextjs.org/docs/app/getting-started/layouts-and-pages
"use client";
// this is the page where we have our user's recipe book and display the foods in it
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function generateStaticParams() {}
 
// handle the books by name
export default function RecipeBookPage() {
  const { bookName } = useParams();
  const displayBookName = typeof bookName === 'string' ? bookName.replaceAll('-', ' ') : '';
  const [foods, setFoods] = useState<{ id: string; name: string }[]>([]);
  const [newFoodName, setNewFoodName] = useState('');// state for new food name
  
  const addFood = () => {
    // Prevent adding empty or whitespace-only names
    if (!newFoodName.trim()) return;

    const newFood = {
      id: `food-${Date.now()}`,
      name: newFoodName.trim(),
    };
    setFoods([...foods, newFood]);

    // Clear the input
    setNewFoodName('');
  };

  const deleteFood = (id: string) => {
    setFoods(foods.filter((food) => food.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{displayBookName}</h2>
      <ul>
        {foods.map(food => (
          <li key={food.id} className="mb-2 flex justify-between">
            <Link href={`/book/${displayBookName}/${food.name}`} className="text-blue-500">
              {food.name}
            </Link>
            <button onClick={() => deleteFood(food.name)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter new food name"
          value={newFoodName}
          onChange={(e) => setNewFoodName(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
        />
        <button onClick={addFood} className="bg-green-500 text-white px-4 py-2">
          + Add Food
        </button>
      </div>
      
    </div>
  );

}