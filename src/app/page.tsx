import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import RecipeBookActions from '@/app/components/RecipeBookActions'

export const dynamic = 'force-dynamic';

export default async function Page() {
    const session = (await cookies()).get('session')?.value;

    if (!session) {
        console.log('No session found, redirecting to login');
        redirect('/login'); // This will throw and be handled by Next.js
    }

    let payload;
    try {
        // Attempt to decrypt the session
        payload = await decrypt(session);
    } catch (error) {
        // This catch block is for unexpected errors during the decryption process itself
        console.error('Session decryption process failed with an unexpected error:', error);
        redirect(`/403`); // Redirect to 403 for these unexpected errors
    }

    // After the try-catch, check if decryption was successful but yielded no payload
    // (e.g., session token was invalid or expired)
    if (!payload) {
        console.log('Session is invalid or decryption yielded no payload, redirecting to login');
        redirect('/login'); // Redirect to login if payload is not valid
    }

    // If we reach here, payload is valid
    console.log('Fetching data for', payload.username);
    
    return <RecipeBookActions username={payload.username}/>;
}