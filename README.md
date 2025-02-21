# 222-project

## Function Signatures
```
======login page======
user name:
pwd:
login register

check_user_pwd(name, pwd) -> credential
create_user(name, pwd) -> credential

=====main page======
plus button
list view

get_book_list(credential) -> list
create_book(credential, book_name)
delete_book(credential, book_name)

======recipe book page======
plus button
list view

get_recipe(credential, book_name, recipe_name) -> list
create_recipe(credential, recipe_name)
delete_recipe(credential, recipe_name)

=====recipe editing page======
pure frontend

get_recipe(credential, book_name, recipe_name) -> recipe_content, access
update_recipe(credential, book_name, recipe_name, recipe_content)
upload_photo() -> photo_url

=====piazza page======
only show public recipes


```
# Next.js
> "Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations."
- Set-up environment
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
    #restart terminal
    nvm install 22 && nvm use 22
    npm install -g npm@latest
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
- all files not using name "page.tsx" or "layout.tsx" are backend files
- Static assets to be served inside the `public` folder can be referenced by your code starting from the base URL (/).
- Code for App Router is at `src/app/` folder. Code for Pages Router is at `src/pages/` folder.
- In the app directory, nested folders define route structure. Each folder represents a route segment that is mapped to a corresponding segment in a URL path. However, even though route structure is defined through folders, a route is not publicly accessible until a page.js or route.js file is added to a route segment. And, even when a route is made publicly accessible, only the content returned by page.js or route.js is sent to the client.
- Private folders can be created by prefixing a folder with an underscore: _folderName


# Reference
1. https://nextjs.org/docs/app/getting-started/project-structure