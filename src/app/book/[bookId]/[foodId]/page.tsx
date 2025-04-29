"use server"
import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import ClientRecipePage from './ClientRecipePage';
import ReactiveButton from 'reactive-button';

export default async function RecipePageWrapper({ params }: { params: { bookId: string, foodId: string } }) {
  const session = (await cookies()).get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload?.username) {
    redirect('/login');  // Redirect if not logged in
  }

// const awaitedParams = await params;
return (
    <ClientRecipePage
        username={payload.username}
        bookId={params.bookId}
        foodId={params.foodId}
    />
);
// return (
//     <ClientRecipePage
//         username={payload.username}
//         bookId={awaitedParams.bookId}
//         foodId={awaitedParams.foodId}
//     />
// );
}

// "use client";
// import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
// import MDEditor, { commands } from '@uiw/react-md-editor'; // https://github.com/uiwjs/react-md-editor?tab=readme-ov-file
// import rehypeSanitize from "rehype-sanitize";
// // import { getEnvVariable } from '@/app/lib/config';
// import { uploadImage } from '@/app/actions/upload';
// import _jsxRuntime from "react/jsx-runtime";
// import { useParams } from "next/navigation";
// import { getRecipe, updateRecipe, getAccessDetails } from "@/app/lib/recipes";

// const example_recipe_name = "Beginner's Guide to FlavorBook";
// const example_ingredients = `Here is an example of how you can use this space for ingredients.

// You can use the button on the top to switch between preview and editing modes.
// Note that you need an empty line between paragraphs. 
// Single line breaks **will not work**.

// You can use the button on the *top right* to enter fullscreen mode.
// When you insert an image, patiently wait for a few seconds, then you will see something like \`![userphoto](some_sort_of_url_here.jpg)\`, and you will see the image once you switch back to preview mode.

// ### Below is an example of ingredients for a recipe "Grilled Chicken as in Chipotle"
// * Chicken thigh: 2 lb
// * Oil: 4 tbsp
// * Adobo chipotle: 2 tbsp + 1.5 tsp
// * Ancho pepper: 2 tsp
// * Ground cumin: 1/2 tbsp
// * Dried oregano: 2 tsp
// * kosher salt: 2 tsp
// * Black pepper`;

// const example_steps = `Here is an example of how you can use this space for steps.

// 1. Mix everything together to marinate the chicken overnight.
// 2. Preheat the grill on medium high.
// 2. Grill a whole piece of thigh for 10-15 min.
// 3. Rest for 5min.
// 4. Cut into smaller pieces.`;

// const imageUploadCommand = {
//     name: 'uploadImage',
//     keyCommand: 'uploadImage',
//     buttonProps: { 'aria-label': 'Insert image' },
//     icon: /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
//         width: "12",
//         height: "12",
//         viewBox: "0 0 20 20",
//         children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
//             fill: "currentColor",
//             d: "M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
//         })
//     }),
//     execute: async (state, api) => {
//         const input = document.createElement('input');
//         input.type = 'file';
//         input.accept = 'image/*';
//         input.style.display = 'none';

//         document.body.appendChild(input);
//         input.click();

//         input.onchange = async () => {
//             if (input.files && input.files[0]) {
//                 const file = input.files[0];
//                 try {
//                     const response = await uploadImage(file);

//                     if (response.errors) {
//                         alert(`Upload failed: ${response.errors.general}`);
//                     } else {
//                         const imageUrl = response.url; // Assume the API returns the uploaded image URL
//                         const modifyText = `![userphoto](${imageUrl})\n`;
//                         api.replaceSelection(modifyText);
//                     }
//                 } catch (error) {
//                     console.error("Image upload failed:", error);
//                     alert("An error occurred while uploading the image.");
//                 }
//             }
//             document.body.removeChild(input);
//         };
//     },
// };

// const editorCommands = [
//     commands.bold,
//     commands.divider,
//     commands.title1,
//     commands.title3,
//     commands.divider,
//     imageUploadCommand,
//     commands.divider,
//     commands.unorderedListCommand,
//     commands.orderedListCommand,
//     commands.checkedListCommand,
//     commands.divider,
// ];

// const editorExtraCommands = [commands.fullscreen];

// //const CATEGORIES = getEnvVariable<string[]>('NEXT_PUBLIC_CATEGORIES');
// const CATEGORIES = ["Uncategorized", "Appetizers", "Main Course", "Vegetables", "Desserts", "Snacks", "Drinks", "Soups", "Carbs", "Half-prepared", "Others"]

// const calculateMarginAdjustedHeight = (el: HTMLElement): number => {
//     const style = window.getComputedStyle(el);
//     const marginTop = parseFloat(style.marginTop) || 0;
//     const marginBottom = parseFloat(style.marginBottom) || 0;
//     return el.offsetHeight + marginTop + marginBottom;
// };

// export default function RecipePage() {
//     const { bookId, foodId } = useParams();
//     const book_id = Number(bookId);
//     const recipe_id = Number(foodId);
//     const [recipe_name, setName] = useState('Set your recipe name here');
//     const [category, setCategory] = useState('');
//     const [value1, setValue1] = useState('');
//     const [value2, setValue2] = useState('');
//     const [preview, setPreview] = useState<'preview' | 'edit'>('preview');
//     const [access, setAccess] = useState<'read_only' | 'coedit' | 'owner' | null>(null);
  
//     // Calculating the height of the editor dynamically    
//     const [mounted, setMounted] = useState(false);
//     const [editorHeight, setEditorHeight] = useState(200);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const fixedElementsRef = useRef<HTMLDivElement>(null);
//     const headerRef1 = useRef<HTMLHeadingElement>(null);
//     const headerRef2 = useRef<HTMLHeadingElement>(null);

//     useEffect(() => {
//         const load = async () => {
//             const recipe = await getRecipe(recipe_id);
//             const accessInfo = await getAccessDetails(username, book_id);

//             setName(recipe.name);
//             setCategory(recipe.category);
//             setValue1(recipe.ingredients);
//             setValue2(recipe.steps);
//             setAccess(accessInfo.access_to_it);
//             console.log('[DEBUG] Access:', accessInfo.access_to_it);
//             };
//             load();
//     }, [book_id, recipe_id]);

//     // Debounce update
//     useEffect(() => {
//       console.log('[DEBUG] Auto-save triggered', {
//         preview, access,
//         recipe_name, category, value1, value2
//       });
//       if (preview !== 'edit' || (access !== 'owner' && access !== 'coedit')) return;
//       const debounce = setTimeout(() => {
//         updateRecipe(recipe_id, recipe_name, category, value1, value2)
//           .then(() => console.log('Auto-saved'))
//           .catch((err) => console.error('Auto-save failed', err));
//       }, 500);
//       return () => clearTimeout(debounce);
//     }, [recipe_name, category, value1, value2, preview, access]);

//     useEffect(() => {
//         setMounted(true);
//         const calculateHeight = () => {
//             if (containerRef.current && fixedElementsRef.current) {
//                 const containerHeight = containerRef.current.offsetHeight;
//                 const fixedHeight = calculateMarginAdjustedHeight(fixedElementsRef.current);
//                 const headerRef1Height = headerRef1.current ? calculateMarginAdjustedHeight(headerRef1.current) : 0;
//                 const headerRef2Height = headerRef2.current ? calculateMarginAdjustedHeight(headerRef2.current) : 0;
//                 const availableHeight = containerHeight - (fixedHeight + headerRef1Height + headerRef2Height);
//                 setEditorHeight(availableHeight / 2); // Divide remaining space between the two editors
//             }
//         };

//         calculateHeight();
//         window.addEventListener("resize", calculateHeight);
//         const timeoutId = setTimeout(calculateHeight, 0);
//         return () => {
//             window.removeEventListener("resize", calculateHeight);
//             clearTimeout(timeoutId);
//         };
//     }, []);
//     if (!access) return <p>Loading recipe...</p>;

//     if (!mounted) return null; // Wait until the component is mounted

//     return (
//         <div
//             ref={containerRef}
//             className="container"
//             style={{
//                 height: "100vh", // Set container height to full webpage height
//                 display: "flex",
//                 flexDirection: "column",
//                 overflow: "hidden", // Disable page scrolling
//             }}
//         >
//             <div ref={fixedElementsRef} style={{ width: "100%" }}>
//                 {preview === "edit" ? (
//                     <input
//                         type="text"
//                         value={recipe_name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="text-2xl font-bold mb-4"
//                         style={{
//                             margin: "10px",
//                             padding: "5px",
//                             fontSize: "1.5rem",
//                             width: "100%", // Occupy full width
//                         }}
//                     />
//                 ) : (
//                     <h1 className="text-2xl font-bold mb-4" style={{ margin: "10px", width: "100%" }}>
//                         {recipe_name}
//                     </h1>
//                 )}

//                 /* handle edit button */
//                 {(access === 'owner' || access === 'coedit') && (
//                     <button
//                         onClick={() => setPreview(preview === "edit" ? "preview" : "edit")}
//                         style={{
//                             margin: "5px",
//                             width: "100%", // Occupy full width
//                         }}
//                     >
//                         Switch to {preview === "edit" ? "Preview" : "Edit"} Mode
//                     </button>
//                 )}

                //<ReactiveButton 
                //    onClick={() => setPreview(preview === "edit" ? "preview" : "edit")}
                //    color="violet" 
                //    idleText={preview === "edit" ? "Switch to Preview Mode" :  "Switch to Edit Mode"} 
                //    style={{
                //        margin: "5px",
                //        width: "100%", // Occupy full width
                //    }}
                ///>
//                 <div style={{ margin: "10px", width: "100%" }}>
//                     <h2 className="text-xl font-bold mb-2">Category:</h2>
//                     {preview === "edit" ? (
//                         <select
//                             value={category}
//                             onChange={(e) => setCategory(e.target.value)}
//                             style={{
//                                 padding: "5px",
//                                 fontSize: "1rem",
//                                 width: "100%", // Occupy full width
//                             }}
//                         >
//                             {CATEGORIES.map((cat) => (
//                                 <option key={cat} value={cat}>
//                                     {cat}
//                                 </option>
//                             ))}
//                         </select>
//                     ) : (
//                         <p className="text-lg" style={{ width: "100%" }}>
//                             {category}
//                         </p>
//                     )}
//                 </div>
//             </div>

//             <h2
//                 ref={headerRef1}
//                 className="text-xl font-bold mb-4"
//                 style={{ width: "100%",margin: "10px",  }}
//             >
//             Ingredients
//             </h2>
                
//             <div style={{ flex: 1, marginBottom: "0px", width: "100%" }}>
//                 <MDEditor
//                     value={value1}
//                     onChange={(value) => setValue1(value || '')} // Ensure 'value' is always a string
//                     previewOptions={{
//                         rehypePlugins: [[rehypeSanitize]],
//                     }}
//                     textareaProps={{
//                         placeholder: "Input here for ingredients.",
//                     }}
//                     preview={preview}
//                     commands={editorCommands}
//                     extraCommands={editorExtraCommands}
//                     //hideToolbar={preview === "preview"}
//                     visibleDragbar={false}
//                     highlightEnable={false}
//                     height={editorHeight}
//                     style={{ whiteSpace: 'white-space-collapse' }}
//                 />
//             </div>
            
//             <h2
//                 ref={headerRef2}
//                 className="text-xl font-bold mb-4"
//                 style={{ width: "100%",margin: "10px",  }}
//             >
//                 Steps
//             </h2>
            
//             <div style={{ flex: 1, marginBottom: "0px", width: "100%" }}>
//                 <MDEditor
//                     value={value2}
//                     onChange={(value) => setValue2(value || '')}
//                     previewOptions={{
//                         rehypePlugins: [[rehypeSanitize]],
//                     }}
//                     textareaProps={{
//                         placeholder: "Input here for steps.",
//                     }}
//                     preview={preview}
//                     commands={editorCommands}
//                     extraCommands={editorExtraCommands}
//                     //hideToolbar={preview === "preview"}
//                     visibleDragbar={false}
//                     highlightEnable={false}
//                     height={editorHeight}
//                     style={{ whiteSpace: 'normal' }}
//                 />
//             </div>
//         </div>
//     );
// }
