const RECIPE_BOOK_API = process.env.NEXT_PUBLIC_RECIPEBOOK_API!;
const RECIPE_API = process.env.NEXT_PUBLIC_RECIPE_API!;
const RECIPE_CONTENT_API = process.env.NEXT_PUBLIC_RECIPE_CONTENT_API!;
// TODO: change signature according to latest readme
// get all recipe books
export async function getRecipeBookList(username: string) {
  const res = await fetch(`${RECIPE_BOOK_API}/?username=${username}`);
  if (!res.ok) throw new Error('Failed to fetch recipe books');
  const data = await res.json();

  // Transform backend format to frontend format
  return data.map((book: any) => ({
    id: book.book_id,
    name: `${book.book_name}${book.is_coedit ? " (co-edit)" : book.is_readonly ? " (read only)" : ""}`,
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
    // todo: verify if it correctly returns the id
    return { id: result.id, name: book_name };
}

// Delete a recipe book by ID
export async function deleteRecipeBook(username: string, book_id: number) {
  const res = await fetch(RECIPE_BOOK_API, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, book_name: book_id }),
  });

  if (!res.ok) throw new Error('Failed to delete recipe book');
}

// change the name of a recipe book, only called by the owner
// TODO: fix 
export async function updateRecipeBook(book_id: number, new_book_name: string) {
  const body = { book_id, new_book_name };
  const res = await fetch(`${RECIPE_BOOK_API}/change_name`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('Failed to update recipe book name');

  return res.ok; // Return true if successful
}

export async function getRecipeBookContent(username: string, book_id: number) {
  const res = await fetch(`${RECIPE_CONTENT_API}/?username=${username}&book_id=${book_id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error('Failed to fetch recipe book content');

  const result = await res.json();
  console.log('GET content result:', result);

  return {
    relationshipsDisplay: result[0],
    listOfRecipeIds: result[1],
    accessToIt: result[2],
  };
}

async function addRecipe(book_id: number, recipe_name: string) {
  const body = {
    book_id,
    recipe_name,
    recipe_category: "Uncategorized",
  };

  const res = await fetch(`${RECIPE_API}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('Failed to add recipe');

  return res.ok; // Return true if successfully added
}

async function deleteRecipe(book_id: number, recipe_id: number) {
  const body = { book_id, recipe_id };

  const res = await fetch(`${RECIPE_API}/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('Failed to delete recipe');

  return res.ok; // Return true if successfully deleted
}

export async function getRecipe(recipe_id: number) {  
  const res = await fetch(`${RECIPE_API}/get_one_recipe?recipe_id=${recipe_id}`);
  if (!res.ok) throw new Error('Failed to fetch recipe details');
  const result = await res.json();
  console.log('GET one recipe result:', result);

  if (!res.ok) throw new Error('Failed to fetch recipe details');
  return {
    id: recipe_id,
    name: result.recipe_name,
    category: result.recipe_category,
    ingredients: result.recipe_ingredients, 
    steps: result.recipe_steps
  };
}

// this function updates the name, category, ingredients and steps of a recipe
export async function updateRecipe(recipe_id: number, recipe_name: string, recipe_category: string, recipe_ingredients: string, recipe_steps: string) {
  const body = { recipe_id, recipe_name, recipe_category, recipe_ingredients, recipe_steps };

  const res = await fetch(`${RECIPE_API}/update_recipe`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('Failed to update recipe');

  return res.ok; // Return true if successful
}


export async function getAccessDetails(username: string, bookId: number) {
  const url = `${RECIPE_BOOK_API}content?username=${username}&book_id=${bookId}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch access info');
  
  const result = await res.json();
  return {
    relationships_display: result.relationships_display,
    recipe_ids: result.list_of_recipe_id,
    access_to_it: result.access_to_it, // 'read_only' | 'coedit' | 'owner'
  };
}
