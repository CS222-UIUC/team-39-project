"use server"
import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import ClientRecipePage from './ClientRecipePage';

export default async function RecipePageWrapper({ params }: { params: { bookId: string, foodId: string } }) {
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);

    if (!session || !payload?.username) {
    redirect('/login');  // Redirect if not logged in
    }

    // const awaitedParams = await params;
    return (
        <ClientRecipePage
            username={payload.username}
            bookId={params.bookId}
            foodId={params.foodId}
        />
    );
}

