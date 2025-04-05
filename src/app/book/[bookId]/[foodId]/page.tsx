"use client";
// page for markdown editor
import { useState } from "react";
import { useParams } from "next/navigation";

export default function FoodDetailPage() {
  const { bookId, foodId, foodName } = useParams();
  const [description, setDescription] = useState("This is the description of the food.");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{typeof foodName === 'string' ? foodName.replace("-", " ") : ""}</h2>
      <textarea
        className="w-full border p-2 h-32"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <p className="mt-2 text-gray-500">
        Editing food inside {typeof bookId === 'string' ? bookId.replace("-", " ") : ""}
      </p>
    </div>
  );
}
