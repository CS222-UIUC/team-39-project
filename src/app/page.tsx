'use server';
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import RecipeBookActions from '@/app/components/RecipeBookActions'
 
export default async function Page() {
    let payload;
    try {
        const session = (await cookies()).get('session')?.value;
        if (!session) {
            console.log('No session found, redirecting to login');
            redirect('/login');
        }
        payload = await decrypt(session);
        if (!payload) {
            console.log('Session decryption failed, redirecting to login');
            redirect('/login');
        }
        console.log('Fetching data for', payload.username);
    } catch (error) {
        console.error('Session verification or decryption failed:', error);
        redirect(`/403`);
    }
    return <RecipeBookActions username={payload.username}/>;
}