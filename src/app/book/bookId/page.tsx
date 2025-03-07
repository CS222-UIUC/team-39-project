// from https://nextjs.org/docs/app/getting-started/layouts-and-pages
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function generateStaticParams() {}
 
export default function RecipeBookPage() {
  const { bookId } = useParams();
  const [foods, setFoods] = useState<{ id: string; name: string }[]>([]);

  const addFood = () => {
    const newFood = { id: `food-${Date.now()}`, name: `Food ${foods.length + 1}` };
    setFoods([...foods, newFood]);
  };

  const deleteFood = (id: string) => {
    setFoods(foods.filter((food) => food.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{typeof bookId === 'string' ? bookId.replace("-", " ") : ''}</h2>
      <ul>
        {foods.map((food) => (
          <li key={food.id} className="mb-2 flex justify-between">
            <Link href={`/book/user-recipebook/${bookId}/${food.id}`} className="text-blue-500">{food.name}</Link>
            <button onClick={() => deleteFood(food.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={addFood} className="mt-4 bg-green-500 text-white px-4 py-2">+ Add Food</button>
    </div>
  );

}