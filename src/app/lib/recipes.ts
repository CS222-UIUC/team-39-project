const RECIPE_BOOK_API = process.env.NEXT_PUBLIC_RECIPEBOOK_API!;

// get all recipe books
export async function getRecipeBookList(username: string) {
  const res = await fetch(`${RECIPE_BOOK_API}/?username=${username}`);
  if (!res.ok) throw new Error('Failed to fetch recipe books');
  const data = await res.json();

  // Transform backend format to frontend format
  return data.map((book: any) => ({
    id: book.RecipeBookId,
    name: book.Name,
  }));
}

// Add a new recipe book
export async function addRecipeBook(username: string, book_name: string) {
  const res = await fetch(RECIPE_BOOK_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, book_name }),
    });
  
    const result = await res.json().catch(() => null);
    console.log('POST result:', result);
  
    if (!res.ok) {
      throw new Error('Failed to add recipe book');
    }
  
    return { id: Date.now(), name: book_name };
}

// Delete a recipe book by ID
export async function deleteRecipeBook(username: string, book_name: string) {
  const res = await fetch(RECIPE_BOOK_API, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, book_name: book_name }),
  });

  if (!res.ok) throw new Error('Failed to delete recipe book');
}

export async function updateRecipeBook(username: string, book_name: string, new_book_name: string) {
  const body = { username, book_name: book_name, new_book_name: new_book_name };
  const res = await fetch(RECIPE_BOOK_API, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await res.json().catch(() => null);
  console.log('PATCH result:', result);
  if (!res.ok) throw new Error('Failed to update recipe book name');
  
  return result; // mock return
}