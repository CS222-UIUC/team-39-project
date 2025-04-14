// from https://nextjs.org/docs/app/getting-started/layouts-and-pages
"use server";
// book page wrapper, server component
// this is the page where we have our user's recipe book and display the foods in it
import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import ClientBookPage from './ClientBookPage';
import { redirect } from 'next/navigation';

export default async function RecipeBookPageWrapper({ params }: { params: { bookId: string } }) {
  const bookId = params.bookId;
  const session = (await cookies()).get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload?.username) {
    redirect('/login'); // Or show a fallback error message
  }

  return <ClientBookPage bookId={bookId} username={payload.username} />;
}
