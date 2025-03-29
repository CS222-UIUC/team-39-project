"use client";
import React, { useState } from "react";
import MDEditor, { commands } from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import { getEnvVariable } from '@/app/lib/config';

const example_recipe_name = "Grilled chicken as in Chipotle";
const example_ingredients = `
* Chicken thigh: 2 lb
* Oil: 4 tbsp
* Adobo chipotle: 2 tbsp + 1.5 tsp
* Ancho pepper: 2 tsp
* Ground cumin: 1/2 tbsp
* Dried oregano: 2 tsp
* kosher salt: 2 tsp
* Black pepper`;
const example_steps = `
1. Mix everything together to marinate the chicken overnight.
2. Preheat the grill on medium high.
2. Grill a whole piece of thigh for 10-15 min.
3. Rest for 5min.
4. Cut into smaller pieces.`;

const editorCommands = [
    commands.bold,
    commands.divider,
    commands.title1,
    commands.title3,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
    commands.divider,
];

const editorExtraCommands = [commands.fullscreen];

const CATEGORIES = getEnvVariable<string[]>('NEXT_PUBLIC_CATEGORIES');

export default function RecipePage() {
    const [value1, setValue1] = useState(example_ingredients);
    const [value2, setValue2] = useState(example_steps);
    const [recipe_name, setName] = useState(example_recipe_name);
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [preview, setPreview] = useState<"edit" | "preview">("preview");

    return (
        <div
            className="container"
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
            {preview === "edit" ? (
                <input
                    type="text"
                    value={recipe_name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-2xl font-bold mb-4"
                    style={{ marginBottom: "10px", padding: "5px", fontSize: "1.5rem" }}
                />
            ) : (
                <h1 className="text-2xl font-bold mb-4">{recipe_name}</h1>
            )}

            <button
                onClick={() => setPreview(preview === "edit" ? "preview" : "edit")}
                style={{ marginBottom: "10px" }}
            >
                Switch to {preview === "edit" ? "Preview" : "Edit"} Mode
            </button>

            <div style={{ marginBottom: "20px" }}>
                <h2 className="text-xl font-bold mb-2">Category:</h2>
                {preview === "edit" ? (
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ padding: "5px", fontSize: "1rem" }}
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p className="text-lg">{category}</p>
                )}
            </div>

            <h2 className="text-xl font-bold mb-4">Ingredients</h2>
            <div style={{ height: "100%", flex: 1, marginBottom: "2px" }}>
                <MDEditor
                    value={value1}
                    onChange={setValue1}
                    previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                    }}
                    style={{ height: "99%", whiteSpace: "normal" }}
                    textareaProps={{
                        placeholder: "Input here for ingredients.",
                    }}
                    preview={preview}
                    commands={editorCommands}
                    extraCommands={editorExtraCommands}
                />
            </div>
            <h2 className="text-xl font-bold mb-4">Steps</h2>
            <div style={{ height: "100%", flex: 1, marginBottom: "30%" }}>
                <MDEditor
                    value={value2}
                    onChange={setValue2}
                    previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                    }}
                    style={{ height: "99%", whiteSpace: "normal" }}
                    textareaProps={{
                        placeholder: "Input here for steps.",
                    }}
                    preview={preview}
                    commands={editorCommands}
                    extraCommands={editorExtraCommands}
                />
            </div>
        </div>
    );
}