"use server"
import { getEnvVariable } from '@/app/lib/config';
import { getUsername } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

const GCS_BUCKET_NAME = getEnvVariable('GCS_BUCKET_NAME');
const GCS_ACCESS_TOKEN = getEnvVariable('GCS_ACCESS_TOKEN');

export async function uploadImage(file: File) {
    const user_name = await getUsername();
    if (!user_name) {
        console.error("User not logged in");
        redirect('/login');
    }

    const fileName = file.name;
    const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
    const objectName = `${user_name}/${Date.now()}.${fileExtension || 'bin'}`; // Use timestamp to avoid conflicts

    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${GCS_BUCKET_NAME}/o?uploadType=media&name=${encodeURIComponent(objectName)}`;

    console.log("Uploading to GCS:", objectName);
    console.log("Upload URL:", uploadUrl);
    console.log("File type:", file.type);

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GCS_ACCESS_TOKEN}`,
                'Content-Type': file.type || 'application/octet-stream', // Infer content type or use a default
            },
            body: file,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("GCS Upload Error:", errorData);
            const errorMessage = errorData.error?.message || "Failed to upload to Google Cloud Storage.";
            return { errors: { general: errorMessage } };
        }

        // The response from GCS after a successful upload contains metadata about the object.
        // We need to construct the public URL.
        const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${objectName}`;
        
        console.log("GCS Upload Successful. Public URL:", publicUrl);
        return { url: publicUrl };

    } catch (error) {
        console.error("Network or other error during GCS upload:", error);
        let errorMessage = "An unexpected error occurred during upload.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return { errors: { general: errorMessage } };
    }
};