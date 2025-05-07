"use server"
import { getEnvVariable } from '@/app/lib/config';
import { getUsername } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { GoogleAuth } from 'google-auth-library'; // Import GoogleAuth

// Environment Variables
const GCS_BUCKET_NAME = getEnvVariable('GCS_BUCKET_NAME');
const GCS_SERVICE_ACCOUNT_KEY_JSON_STRING = getEnvVariable('GCS_SERVICE_ACCOUNT_KEY_JSON');

// --- Helper function to get GCS Access Token ---
async function getGcsAccessToken() {
    if (!GCS_SERVICE_ACCOUNT_KEY_JSON_STRING) {
        console.error("GCS service account key JSON is not configured in environment variables.");
        throw new Error("GCS service account key JSON is not configured.");
    }
    // Log the raw value here
    console.log("Raw GCS_SERVICE_ACCOUNT_KEY_JSON_STRING from env:", GCS_SERVICE_ACCOUNT_KEY_JSON_STRING);

    try {
        const credentials = JSON.parse(GCS_SERVICE_ACCOUNT_KEY_JSON_STRING);
        const auth = new GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/devstorage.read_write'], // Scope for GCS read/write access
        });

        const accessToken = await auth.getAccessToken();
        if (!accessToken) {
            throw new Error("Failed to obtain GCS access token from service account (token is null).");
        }
        return accessToken;
    } catch (error) {
        console.error("Error getting GCS access token:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        // Avoid exposing raw key details in errors sent to client if this error bubbles up.
        throw new Error(`Could not initialize GCS authentication: ${errorMessage}`);
    }
}

export async function uploadImage(file: File) {
    const user_name = await getUsername();
    if (!user_name) {
        console.error("User not logged in, redirecting to login.");
        redirect('/login');
    }

    const fileName = file.name;
    // A more robust way to get file extension
    const fileExtension = fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.') + 1) : '';
    const objectName = `${user_name}/${Date.now()}${fileExtension ? '.' + fileExtension : '.bin'}`;

    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${GCS_BUCKET_NAME}/o?uploadType=media&name=${encodeURIComponent(objectName)}`;

    console.log(`Uploading to GCS: ${objectName}, Bucket: ${GCS_BUCKET_NAME}`);
    console.log(`Upload URL: ${uploadUrl}`);
    console.log(`File type: ${file.type}, File size: ${file.size}`);

    try {
        const accessToken = await getGcsAccessToken(); // Fetch a fresh access token

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Use the dynamically fetched token
                'Content-Type': file.type || 'application/octet-stream',
            },
            body: file,
        });

        if (!response.ok) {
            let errorData;
            let errorResponseMessage = `GCS Error: ${response.status} ${response.statusText}.`;
            try {
                errorData = await response.json(); // GCS often returns JSON errors
                console.error("GCS Upload Error Response (JSON):", JSON.stringify(errorData, null, 2));
                errorResponseMessage = errorData?.error?.message || errorResponseMessage;
            } catch (e) {
                // If response is not JSON, or JSON parsing fails, try to read as text
                const errorText = await response.text();
                console.error("GCS Upload Error Response (Text):", errorText);
                errorResponseMessage = `${errorResponseMessage} Response body: ${errorText.substring(0, 500)}`;
            }
            return { errors: { general: errorResponseMessage } };
        }

        // The response from GCS after a successful upload contains metadata about the object.
        const gcsResponseData = await response.json();
        console.log("GCS Upload Successful Response:", JSON.stringify(gcsResponseData, null, 2));

        // Construct the public URL (ensure your bucket/object ACLs allow public access if needed)
        const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${objectName}`;
        
        console.log("GCS Upload Successful. Public URL:", publicUrl);
        return { url: publicUrl, gcsData: gcsResponseData }; // Optionally return more GCS data

    } catch (error) {
        console.error("Network or other error during GCS upload (or token acquisition):", error);
        let errorMessage = "An unexpected error occurred during upload.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return { errors: { general: errorMessage } };
    }
}