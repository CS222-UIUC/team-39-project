'use client';

import rehypeSanitize from 'rehype-sanitize';
import React, { useState, useEffect, useRef } from "react";
import MDEditor, { commands } from '@uiw/react-md-editor'; // https://github.com/uiwjs/react-md-editor?tab=readme-ov-file
import _jsxRuntime from "react/jsx-runtime";
import { useParams as useNextParams } from "next/navigation";
import ReactiveButton from 'reactive-button';

import { getRecipe, updateRecipe, getAccessDetails } from "@/app/lib/recipes";
import { uploadImage } from '@/app/actions/upload';

// Define categories
const CATEGORIES = ["Uncategorized", "Appetizers", "Main Course", "Vegetables", "Desserts", "Snacks", "Drinks", "Soups", "Carbs", "Half-prepared", "Others"];

// Helper function for height calculation
const calculateMarginAdjustedHeight = (el: HTMLElement): number => {
  const style = window.getComputedStyle(el);
  const marginTop = parseFloat(style.marginTop) || 0;
  const marginBottom = parseFloat(style.marginBottom) || 0;
  return el.offsetHeight + marginTop + marginBottom;
};

const imageUploadCommand = {
    name: 'uploadImage',
    keyCommand: 'uploadImage',
    buttonProps: { 'aria-label': 'Insert image' },
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
        width: "12",
        height: "12",
        viewBox: "0 0 20 20",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
            fill: "currentColor",
            d: "M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        })
    }),
    execute: async (state, api) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        document.body.appendChild(input);
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                try {
                    const response = await uploadImage(file);

                    if (response.errors) {
                        alert(`Upload failed: ${response.errors.general}`);
                    } else {
                        const imageUrl = response.url; // Assume the API returns the uploaded image URL
                        const modifyText = `![userphoto](${imageUrl})\n`;
                        api.replaceSelection(modifyText);
                    }
                } catch (error) {
                    console.error("Image upload failed:", error);
                    alert("An error occurred while uploading the image.");
                }
            }
            document.body.removeChild(input);
        };
    },
};

const editorCommands = [
    commands.bold,
    commands.divider,
    commands.title1,
    commands.title3,
    commands.divider,
    imageUploadCommand,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
    commands.divider,
];

const editorExtraCommands = [commands.fullscreen];

interface ClientRecipePageProps {
    username: string;
    bookId: string;
    foodId: string;
}

export default function ClientRecipePage({ username, bookId, foodId }: ClientRecipePageProps) {
    const [recipeName, setRecipeName] = useState('');
    const [recipeCategory, setRecipeCategory] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [preview, setPreview] = useState<'edit' | 'preview'>('preview');
    const [access, setAccess] = useState<'owner' | 'coedit' | 'read_only'>('read_only');

    // Calculating the height of the editor dynamically
    const [mounted, setMounted] = useState(false);
    const [editorHeight, setEditorHeight] = useState(20);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const headerRef1 = useRef<HTMLHeadingElement>(null);
    const headerRef2 = useRef<HTMLHeadingElement>(null);
    
    useEffect(() => {
        const loadData = async () => {
            const recipe = await getRecipe(parseInt(foodId));
            setRecipeName(recipe.name);
            setRecipeCategory(recipe.category);
            setIngredients(recipe.ingredients);
            setSteps(recipe.steps);

            const accessInfo = await getAccessDetails(username, parseInt(bookId));
            setAccess(accessInfo.access_to_it);
            console.log('Access:', accessInfo.access_to_it);
        };

        loadData();
    }, [bookId, foodId, username]);
    
    useEffect(() => {
        console.log('[DEBUG] Auto-save triggered', {
            preview, access,
            recipeName, recipeCategory, ingredients, steps
        });
        if (preview !== 'edit' || (access !== 'owner' && access !== 'coedit')) return;
        const debounce = setTimeout(() => {
            const safeIngredients = ingredients ?? ''; 
            const safeSteps = steps ?? '';
            updateRecipe(parseInt(foodId), recipeName, recipeCategory, safeIngredients, safeSteps)
                .then(() => console.log('Auto-saved'))
                .catch((err) => console.error('Auto-save failed', err));
        }, 500);
        return () => clearTimeout(debounce);
    }, [recipeName, recipeCategory, ingredients, steps, preview, access]);

    useEffect(() => {
        setMounted(true);
        
        const calculateHeight = () => {
            if (containerRef.current) {
                const availableHeight = 
                    containerRef.current.offsetHeight
                    - (titleRef.current ? calculateMarginAdjustedHeight(titleRef.current) : 0)
                    - (buttonRef.current ? calculateMarginAdjustedHeight(buttonRef.current) : 0)
                    - (headerRef1.current ? calculateMarginAdjustedHeight(headerRef1.current) : 0)
                    - (headerRef2.current ? calculateMarginAdjustedHeight(headerRef2.current) : 0);
                    
                console.log('Available height:', availableHeight);
                // Adjust the calculation to avoid double scrollbars
                // Subtract a few pixels to give some breathing room
                setEditorHeight(Math.floor(availableHeight / 2));
            }
        };

        // Initial calculation
        calculateHeight();
        
        // Add event listener for window resize
        window.addEventListener("resize", calculateHeight);
        
        // Use multiple timeouts to ensure proper calculation after full render
        const timeoutId1 = setTimeout(calculateHeight, 0);
        const timeoutId2 = setTimeout(calculateHeight, 100);
        const timeoutId3 = setTimeout(calculateHeight, 500);
        
        return () => {
            window.removeEventListener("resize", calculateHeight);
            clearTimeout(timeoutId1);
            clearTimeout(timeoutId2);
            clearTimeout(timeoutId3);
        };
    }, [preview]); // Include preview in dependencies to recalculate when switching modes

    if (!mounted) return null; // Wait until the component is mounted

    return (
        <div
            ref={containerRef}
            className="container w-full"
            style={{
                height: "100vh", // Set container height to full webpage height
                width: "100%",
                overflow: "hidden", // Disable page scrolling
            }}
        >
            <div ref={titleRef} className="w-full">
                {
                    // ========== Recipe Title ==========
                    preview === "edit" ? (
                        <input
                            type="text"
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                            className="text-2xl font-bold m-0 mt-2 p-1 pl-6 w-full text-center border-2 border-gray-300 rounded-md"
                            placeholder="Enter recipe name here..."
                        />
                    ) : (
                        <h1 className="text-2xl font-bold m-1 p-1 w-full text-center" style={{ margin: "10px", width: "100%" }}>
                            {recipeName}
                        </h1>
                    )
                }
            </div>
            
            <div ref={buttonRef} className="w-full flex justify-center items-center">
                <ReactiveButton 
                    color="violet"
                    idleText="Return to Recipe List"
                    className="w-1/2 m-1"
                />

                <ReactiveButton 
                    onClick={() => setPreview(preview === "edit" ? "preview" : "edit")}
                    color="violet" 
                    idleText={preview === "edit" ? "Switch to Preview Mode" :  "Switch to Edit Mode"} 
                    className="w-1/2 m-1 ml-2"
                />

                <div style={{ margin: "10px", width: "100%" }}>
                    <h2 className="text-xl font-bold mb-2">Category:</h2>
                    {preview === "edit" ? (
                        <select
                            value={recipeCategory}
                            onChange={(e) => setRecipeCategory(e.target.value)}
                            style={{
                                padding: "5px",
                                fontSize: "1rem",
                                width: "100%", // Occupy full width
                            }}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-lg" style={{ width: "100%" }}>
                            {recipeCategory}
                        </p>
                    )}
                </div>
            </div>

            <h2
                ref={headerRef1}
                className="text-xl font-bold mb-4"
                style={{ width: "100%",margin: "10px",  }}
            >
            Ingredients
            </h2>
                
            <div style={{ flex: 1, marginBottom: "0px", width: "100%", overflow: "hidden" }}>
                <MDEditor
                    value={ingredients}
                    onChange={(value) => setIngredients(value || '')} // Ensure 'value' is always a string
                    previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                    }}
                    textareaProps={{
                        placeholder: "Input here for ingredients.",
                    }}
                    preview={preview}
                    commands={editorCommands}
                    extraCommands={editorExtraCommands}
                    visibleDragbar={false}
                    highlightEnable={false}
                    height={editorHeight}
                    style={{ 
                      whiteSpace: 'white-space-collapse',
                      overflow: 'auto'
                    }}
                />
            </div>
            
            <h2
                ref={headerRef2}
                className="text-xl font-bold mb-4"
                style={{ width: "100%",margin: "10px",  }}
            >
                Steps
            </h2>
            
            <div style={{ flex: 1, marginBottom: "0px", width: "100%", overflow: "hidden" }}>
                <MDEditor
                    value={steps}
                    onChange={(value) => setSteps(value || '')}
                    previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                    }}
                    textareaProps={{
                        placeholder: "Input here for steps.",
                    }}
                    preview={preview}
                    commands={editorCommands}
                    extraCommands={editorExtraCommands}
                    visibleDragbar={false}
                    highlightEnable={false}
                    height={editorHeight}
                    style={{ 
                      whiteSpace: 'normal',
                      overflow: 'auto'
                    }}
                />
            </div>
        </div>
    );
}