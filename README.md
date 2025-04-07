# FlavorBook

## Backend Objects
- user
    - user_id
    - username
    - pwd
    - owner_of: list of recipe book id
    - read_access_to: list of recipe book id
    - coedit_access_to: list of recipe book id
- recipe book
    - book_id
    - book_name (might contain whitespace, emoji, etc.)
    - book_list
- recipe
    - recipe_id
    - recipe_name (might contain whitespace, emoji, etc.)
    - recipe_category (appetizer, main course, dessert, etc.)
    - recipe_ingredients
    - recipe_steps

## Backend Signatures
```
======login page======(Done)
http://localhost:2333/api/login
- type: post
- input: name, password
- return: response.ok == True if successful

======signup page======
http://localhost:2333/api/signup
- type: post
- input: name, password
- return: response.ok == True if successful

======user page======(To do)
http://localhost:2333/api/user/invite_read
- type: post
- input: username, invited_username, book_name
- return: response.ok == True if successful
    
http://localhost:2333/api/user/invite_coedit
- type: post
- input: username, invited_username, book_name
- return: response.ok == True if successful

=====main page======
http://localhost:2333/api/recipebook/
- type: get
- input: username
- return: list of all recipe books

http://localhost:2333/api/recipebook/
- type: post
- input: username, book_name
- return: response.ok == True if successful

http://localhost:2333/api/recipebook/
- type: delete
- input: username, book_name
- return: response.ok == True if successful

http://localhost:2333/api/recipebook/
- type: patch
- input: username, book_name, new_book_name
- return: response.ok == True if successful

======recipe book page======
Note: Recipe must be inside some recipe book, so we need to create a new recipe book when new user signed up.
http://localhost:2333/api/recipe/
- type：get
- input: username, book_name
- return: list of recipes in the given recipe book

http://localhost:2333/api/recipe/
- type: post
- input: username, book_name, recipe_name, recipe_Ingredients, recipe_Steps, recipe_Category
- return: response.ok == True if successfully add a new recipe to the given recipe book.

http://localhost:2333/api/recipe/
- type: delete
- input: username, book_name, recipe_name
- return: response.ok == True if successfully delete a recipe from the given recipe book


=====recipe editing page======
http://localhost:2333/api/recipe/get_one_recipe
- type: get
- input: username, book_name, recipe_name
- return: recipe_name, recipe_category, recipe_ingredients (markdown), recipe_steps (markdown)

http://localhost:2333/api/recipe/update_recipe
-type：update
- input: username, book_name, recipe_name, recipe_category, recipe_ingredients, recipe_steps
- return: response.ok == True if successful

http://localhost:2333/api/recipe/upload_photo(Should be done in frontend)
- input: username, book_name, recipe_name, photo
- return: photo_url

=====piazza page======
http://localhost:2333/api/get_recipe_list
- return: list of (recipe owner usernames, recipe names)

```
# Set up backend
```
cd src/app/backend
npm install express mysql dotenv nodemon cors bcrypt jsonwebtoken
```

# Run backend
```
cd src/app/backend
npm run dev
```

# Next.js
> "Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations."
- How to learn
    - Zory's currently at https://nextjs.org/docs/app/getting-started/layouts-and-pages
- Set-up environment
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
    #restart terminal
    nvm install 22 && nvm use 22
    npm install -g npm@latest
    npm install next@latest react@latest react-dom@latest zod jose fs nock next-remove-imports @uiw/react-md-editor@v3.6.0 rehype-sanitize
    pnpm add iron-session
    ```
- Development
    - Run `npm run dev` to start the development server.
    - Visit http://localhost:3000 to view your application.
    - The page auto-updates as you edit the file.
- Deploy
    - The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

# File structures
```
├── book
│   └── page.tsx
|   └── layout.tsx
|       └── page.tsx
|       └── bookName
|           └── page.tsx
|           └── foodName
|               └── page.tsx
├── db
│   └── db.tsx
├── favicon.ico
├── globals.css
├── layout.tsx
├── login
│   ├── backend.tsx
│   └── page.tsx
├── page.tsx
├── piazza
├── recipe
│   └── page.tsx
└── settings
    └── page.tsx
```
- Next.js uses file-system based routing. In other words, urls will be based on the file structure. Folders are used to define the route segments that map to URL segments. Files (like page and layout) are used to create UI that is shown for a segment. (A forder, a page.)
- all files not using name "page.tsx" or "layout.tsx" are backend files
- layout: A layout is UI that is shared between multiple pages. On navigation, layouts preserve state, remain interactive, and do not rerender.
- Static assets to be served inside the `public` folder can be referenced by your code starting from the base URL (/).
- Code for App Router is at `src/app/` folder. Code for Pages Router is at `src/pages/` folder.
- In the app directory, nested folders define route structure. Each folder represents a route segment that is mapped to a corresponding segment in a URL path. However, even though route structure is defined through folders, a route is not publicly accessible until a page.js or route.js file is added to a route segment. And, even when a route is made publicly accessible, only the content returned by page.js or route.js is sent to the client.
- Private folders can be created by prefixing a folder with an underscore: _folderName

# Testing
Jest: https://nextjs.org/docs/app/building-your-application/testing/jest

# Reference
1. https://nextjs.org/docs/app/getting-started/project-structure

# Just for backup
```
const TestButton = () => {
    console.log("TestButton ready");
    const click = async () => {
        try {
            alert("Button clicked!");
            console.log("clicked");
            const response = await fetch("http://localhost:2333/api/recipe/1", {
                method: 'GET',
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Fetched data:", data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    return (
        <button onClick={click}>Click here for signing up instead</button>
    );
};
```