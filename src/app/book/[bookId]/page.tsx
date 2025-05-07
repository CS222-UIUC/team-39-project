// from https://nextjs.org/docs/app/getting-started/layouts-and-pages
"use server";
// book page wrapper, server component
// this is the page where we have our user's recipe book and display the foods in it
import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import ClientBookPage from './ClientBookPage';
import { redirect } from 'next/navigation';

type PageProps = {
    params: Promise<{ bookId: string }>; // Modified to be a Promise
}

export default async function RecipeBookPageWrapper(props: PageProps) 
{
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
  
    const resolvedParams = await props.params; // Await the params
    const bookId = parseInt(resolvedParams.bookId, 10); // Access bookId from resolved params
    return <ClientBookPage id={bookId} username={payload.username} />;
}