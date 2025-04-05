"use client";
// from https://nextjs.org/docs/app/getting-started/layouts-and-pages
// this is the page where we have our user's recipe book list
// we will need to fetch the user's recipe book list from the server
// and display it here
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from "react-complex-tree";
import { useRouter } from "next/navigation";
import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/app/ui/post'
import { getPosts } from '@/app/lib/posts'


export default function RecipeBookList() {
  const [books, setBooks] = useState<{ id: string; name: string }[]>([]);

  // fetch the user's recipe book list from the server
  const addBook = () => {
    const name = prompt("Enter the name of the new recipe book:");
    if (!name) return;
    const newBook = { id: `book-${Date.now()}`, name };// for now, book id is assigned as book-<timestamp>
    setBooks([...books, newBook]);
  };

  // delete a book from the list
  const deleteBook = (id: string) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User's Recipe Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id} className="mb-2 flex justify-between">
            {/* for mapping links */}
            <Link href={`/book/${book.id.replaceAll(' ', '-')}`}>
              {book.id}
            </Link>
            <button onClick={() => deleteBook(book.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={addBook} className="mt-4 bg-green-500 text-white px-4 py-2">+ Add Recipe Book</button>
    </div>
  );
}
