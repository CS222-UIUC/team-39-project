const RECIPE_BOOK_API = process.env.NEXT_PUBLIC_RECIPEBOOK_API!;
const RECIPE_API = process.env.NEXT_PUBLIC_RECIPE_API!;
const RECIPE_CONTENT_API = process.env.NEXT_PUBLIC_RECIPE_CONTENT_API!;
// TODO: change signature according to latest readme
// get all recipe books
export async function getRecipeBookList(username: string) {
  const res = await fetch(`${RECIPE_BOOK_API}/?username=${username}`);
  if (!res.ok) throw new Error('Failed to fetch recipe books');
  const data = await res.json();

  return data.map((book: any) => {
    const displayName = book.book_displayname ?? 'Unnamed Book';

    let access: 'owner' | 'coedit' | 'read_only' = 'owner';
    if (displayName.endsWith('(coedit)')) access = 'coedit';
    else if (displayName.endsWith('(read only)')) access = 'read_only';

    return {
      id: book.book_id,
      displayName,
      access
    };
  });
}
// Add a new recipe book
export async function addRecipeBook(username: string, book_name: string) {
  const res = await fetch(`${RECIPE_BOOK_API}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, book_name }),
  });

  if (!res.ok) {
    const errorMsg = await res.text();
    console.error('Error creating recipe book:', errorMsg);
    throw new Error('Failed to create recipe book');
  }

  const result = await res.json();

  return {
    id: result.book_id, 
    name: book_name,
  };
}

// Delete a recipe book by ID
export async function deleteRecipeBook(username: string, book_id: number) {
  const res = await fetch(RECIPE_BOOK_API, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, book_id }),
  });

  if (!res.ok) throw new Error('Failed to delete recipe book');
}

// change the name of a recipe book, only called by the owner
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
    relationships_display: result.relationships_display,
    recipe_ids: result.list_of_recipe_id,
    access_to_it: result.access_to_it,
  };
}

export async function inviteReadOnly(username: string, invitedUsername: string, bookId: number) {
  const body = { username, invited_username: invitedUsername, book_id: bookId };

  const res = await fetch(`${RECIPE_BOOK_API}/invite_readonly`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = result.error || 'Failed to invite read-only user';
    throw new Error(errorMsg);
  }

  return res.ok;
}

export async function inviteCoedit(username: string, invitedUsername: string, bookId: number) {
  const body = { username, invited_username: invitedUsername, book_id: bookId };

  const res = await fetch(`${RECIPE_BOOK_API}/invite_coedit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = result.error || 'Failed to invite coeditor';
    throw new Error(errorMsg);
  }

  return res.ok;
}

export async function addRecipe(book_id: number, recipe_name: string) {
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

  if (!res.ok){
    const errorMsg = await res.text();
    console.error('Error adding recipe:', errorMsg);
    throw new Error('Failed to add recipe');
}

  return res.ok; // Return true if successfully added
}

export async function deleteRecipe(book_id: number, recipe_id: number) {
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

export async function getBookNameById(username: string, bookId: number): Promise<string> {
  const res = await fetch(`${RECIPE_BOOK_API}/?username=${username}`);
  if (!res.ok) throw new Error('Failed to fetch recipe books');

  const data = await res.json(); // list of all books
  const book = data.find((b: any) => b.book_id === bookId);

  if (!book) {
    console.warn(`Book with id ${bookId} not found`);
    return `Book ${bookId}`;
  }

  let displayName = book.book_displayname ?? `Book ${bookId}`;

  displayName = displayName.replace(/\s*\(coedit\)$/, '').replace(/\s*\(read only\)$/, '');

  return displayName;
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
  const url = `${RECIPE_BOOK_API}/content?username=${username}&book_id=${bookId}`;
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
