"use server"
import { getEnvVariable } from '@/app/lib/config';
import { getUsername } from '@/app/actions/auth';
const UPLOAD_API = getEnvVariable('UPLOAD_API');
const UPLOAD_API_KEY = getEnvVariable('UPLOAD_API_KEY');

export async function uploadImage(file: File) {
    // https://www.imagehub.cc/api-v1
    const user_name = await getUsername();
    if (!user_name) {
        console.error("User not logged in");
        return { errors: { general: "User not logged in" } };
    }
    
    const formData = new FormData();
    formData.append("source", file);
    formData.append("description", `Uploaded by ${user_name}`);
    formData.append("format", "txt");
    formData.append("width", "1024");
    formData.append("album_id", "CpxWr");

    console.log("formData", formData);
    console.log("UPLOAD_API", UPLOAD_API);
    console.log("UPLOAD_API_KEY", UPLOAD_API_KEY);
    const response = await fetch(UPLOAD_API, {
        method: 'POST',
        headers: {
            'X-API-Key': UPLOAD_API_KEY,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.error);
        return { errors: { general: errorData.error } };
    }
    const url = await response.text();
    if (url == "重复上传") {
        console.error("Duplicate upload");
        return { errors: { general: "Duplicate upload is not allowed" } };
    }
    // potential response: "API V1 public key can't be null. Go to /dashboard and set the Guest API key."
    
    console.log("Received URL:", url);
    return { url: url };
};