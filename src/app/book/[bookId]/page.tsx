// from https://nextjs.org/docs/app/getting-started/layouts-and-pages
"use client";
// this is the page where we have our user's recipe book and display the foods in it
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
// actions for updating the recipe book title
// import { updateRecipeBookTitle } from '@/app/actions/updateRecipeBook';

function generateStaticParams() {}
 
// handle the books by name
export default function RecipeBookPage() {
  const { bookId } = useParams();
  // const displayBookName = typeof bookName === 'string' ? bookName.replaceAll('-', ' ') : '';

  // const [foods, setFoods] = useState<{ id: string; name: string }[]>([]);
  // const [newFoodName, setNewFoodName] = useState('');// state for new food name
  
  // const addFood = () => {
  //   // Prevent adding empty or whitespace-only names
  //   if (!newFoodName.trim()) return;

  //   const newFood = {
  //     id: `food-${Date.now()}`,
  //     name: newFoodName.trim(),
  //   };
  //   setFoods([...foods, newFood]);

  //   // Clear the input
  //   setNewFoodName('');
  // };

  // const deleteFood = (id: string) => {
  //   setFoods(foods.filter((food) => food.id !== id));
  // };

  // return (
  //   <div className="p-6">
  //     <h2 className="text-2xl font-bold mb-4">{bookId}</h2>
  //     <ul>
  //       {foods.map(food => (
  //         <li key={food.id} className="mb-2 flex justify-between">
  //           <Link href={`/book/${bookId}/${food.id}`} className="text-blue-500">
  //             {food.name}
  //           </Link>
  //           <button onClick={() => deleteFood(food.id)} className="text-red-500">
  //             Delete
  //           </button>
  //         </li>
  //       ))}
  //     </ul>
      
  //     <div className="mt-4">
  //       <input
  //         type="text"
  //         placeholder="Enter new food name"
  //         value={newFoodName}
  //         onChange={(e) => setNewFoodName(e.target.value)}
  //         className="border rounded px-2 py-1 mr-2"
  //       />
  //       <button onClick={addFood} className="bg-green-500 text-white px-4 py-2">
  //         + Add Food
  //       </button>
  //     </div>
      
  //   </div>
  // );
  const readableBookName = bookId?.toString().replaceAll('-', ' ') || '';

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

  const handleTitleSave = () => {
    // This only updates display name locally
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditedBookName(readableBookName);
    setIsEditingTitle(false);
  };

  return (
    <div className="p-6 text-white">
      {/* Editable Recipe Book Title */}
      {isEditingTitle ? (
        <div className="flex items-center gap-2 mb-4">
          <input
            className="text-black px-2 py-1 rounded"
            value={editedBookName}
            onChange={(e) => setEditedBookName(e.target.value)}
          />
          <button
            onClick={handleTitleSave}
            className="bg-blue-500 px-3 py-1 rounded text-white"
          >
            Save
          </button>
          <button
            onClick={handleTitleCancel}
            className="bg-gray-500 px-3 py-1 rounded text-white"
          >
            Cancel
          </button>
        </div>
      ) : (
        <h1
          className="text-2xl font-bold mb-4 cursor-pointer"
          onClick={() => setIsEditingTitle(true)}
        >
          {editedBookName}
        </h1>
      )}

      {/* Add Food Form */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          className="text-black px-2 py-1 rounded"
          placeholder="Enter new food name"
          value={newFoodName}
          onChange={(e) => setNewFoodName(e.target.value)}
        />
        <button
          onClick={addFood}
          className="bg-green-500 px-3 py-1 rounded text-white"
        >
          + Add Food
        </button>
      </div>

      {/* Food List */}
      <ul>
        {foods.map((food) => (
          <li key={food.id}>
            <Link
              href={`/book/${bookId}/${food.id}`}
              className="text-blue-400 hover:underline"
            >
              {food.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}