"use client";
import Image from "next/image";
import React, { useState, useContext } from "react";
import MDEditor, { commands, EditorContext } from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import dynamic from "next/dynamic";
import { getEnvVariable } from '@/app/lib/config';

const example_content = `# Grilled chicken as in Chipotle

### Ingredient
* Chicken thigh: 2 lb 
* Oil: 4 tbsp
* Adobo chipotle: 2 tbsp + 1.5 tsp 
* Ancho pepper: 2 tsp
* Ground cumin: 1/2 tbsp 
* Dried oregano: 2 tsp
* kosher salt: 2 tsp
* Black pepper

### Steps
1. Mix everything together to marinate the chicken overnight.
2. Preheat the grill on medium high.
2. Grill a whole piece of thigh for 10-15 min.
3. Rest for 5min.
4. Cut into smaller pieces.`

const Button = () => {
    const { preview, dispatch } = useContext(EditorContext);
    const click = () => {
        dispatch({
        preview: preview === "edit" ? "preview" : "edit"
        });
    };
    if (preview === "edit") {
        return (
        <svg width="12" height="12" viewBox="0 0 520 520" onClick={click}>
            <polygon
            fill="currentColor"
            points="0 71.293 0 122 319 122 319 397 0 397 0 449.707 372 449.413 372 71.293"
            />
            <polygon
            fill="currentColor"
            points="429 71.293 520 71.293 520 122 481 123 481 396 520 396 520 449.707 429 449.413"
            />
        </svg>
        );
    }
    return (
        <svg width="12" height="12" viewBox="0 0 520 520" onClick={click}>
        <polygon
            fill="currentColor"
            points="0 71.293 0 122 38.023 123 38.023 398 0 397 0 449.707 91.023 450.413 91.023 72.293"
        />
        <polygon
            fill="currentColor"
            points="148.023 72.293 520 71.293 520 122 200.023 124 200.023 397 520 396 520 449.707 148.023 450.413"
        />
        </svg>
    );
};

const previewToggle = {
    name: "toggle",
    keyCommand: "toggle",
    value: "toggle",
    icon: <Button />
};

export default function RecipePage() {
    const [value, setValue] = useState(example_content);

    return (
        <div 
            className="container" 
            style={{ height: '99%', display: 'flex', flexDirection: 'column' }}
        >
            <h1 className="text-2xl font-bold mb-4">Recipe Page</h1>
            
            <div style={{ flex: 1 }}>
                <MDEditor 
                    value={value} 
                    onChange={setValue} 
                    previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                    }}
                    style={{ height: '99%', whiteSpace: 'normal' }} // Editor occupies full height
                    textareaProps={{
                        placeholder: 'Input here to start your new recipe.',
                    }}
                    preview="edit"
                    commands={[
                        commands.bold,
                        commands.divider,
                        commands.title1,
                        commands.title3,
                        commands.divider,
                        commands.unorderedListCommand, 
                        commands.orderedListCommand, 
                        commands.checkedListCommand,
                        commands.divider,
                    ]}
                    extraCommands={[
                        previewToggle, commands.fullscreen
                    ]}
                />
            </div>
        </div>
    );
}