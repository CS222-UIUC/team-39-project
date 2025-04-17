"use client";
// page for markdown editor
import { useState } from "react";
import { useParams } from "next/navigation";

export default function FoodDetailPage() {
  const { bookId, foodId, foodName } = useParams();
  const [description, setDescription] = useState("This is the description of the food.");

    return (
        <div
            ref={containerRef}
            className="container"
            style={{
                height: "100vh", // Set container height to full webpage height
                display: "flex",
                flexDirection: "column",
                overflow: "hidden", // Disable page scrolling
            }}
        >
            <div ref={fixedElementsRef} style={{ width: "100%" }}>
                {preview === "edit" ? (
                    <input
                        type="text"
                        value={recipe_name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-2xl font-bold mb-4"
                        style={{
                            margin: "10px",
                            padding: "5px",
                            fontSize: "1.5rem",
                            width: "100%", // Occupy full width
                        }}
                    />
                ) : (
                    <h1 className="text-2xl font-bold mb-4" style={{ margin: "10px", width: "100%" }}>
                        {recipe_name}
                    </h1>
                )}

                <button
                    onClick={() => setPreview(preview === "edit" ? "preview" : "edit")}
                    style={{
                        margin: "5px",
                        width: "100%", // Occupy full width
                    }}
                >
                    Switch to {preview === "edit" ? "Preview" : "Edit"} Mode
                </button>

                <div style={{ margin: "10px", width: "100%" }}>
                    <h2 className="text-xl font-bold mb-2">Category:</h2>
                    {preview === "edit" ? (
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
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
                            {category}
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
                
            <div style={{ flex: 1, marginBottom: "0px", width: "100%" }}>
                <MDEditor
                    value={value1}
                    onChange={(value) => setValue1(value || '')} // Ensure 'value' is always a string
                    previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                    }}
                    textareaProps={{
                        placeholder: "Input here for ingredients.",
                    }}
                    preview={preview}
                    commands={editorCommands}
                    extraCommands={editorExtraCommands}
                    //hideToolbar={preview === "preview"}
                    visibleDragbar={false}
                    highlightEnable={false}
                    height={editorHeight}
                    style={{ whiteSpace: 'white-space-collapse' }}
                />
            </div>
            
            <h2
                ref={headerRef2}
                className="text-xl font-bold mb-4"
                style={{ width: "100%",margin: "10px",  }}
            >
                Steps
            </h2>
            
            <div style={{ flex: 1, marginBottom: "0px", width: "100%" }}>
                <MDEditor
                    value={value2}
                    onChange={(value) => setValue2(value || '')}
                    previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                    }}
                    textareaProps={{
                        placeholder: "Input here for steps.",
                    }}
                    preview={preview}
                    commands={editorCommands}
                    extraCommands={editorExtraCommands}
                    //hideToolbar={preview === "preview"}
                    visibleDragbar={false}
                    highlightEnable={false}
                    height={editorHeight}
                    style={{ whiteSpace: 'normal' }}
                />
            </div>
        </div>
    );
}
