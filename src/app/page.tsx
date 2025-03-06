// from https://react.dev/learn
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { logout } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session)
   
    if (!session || !payload) {
        redirect('/login')
    }
    else {
        let title = <h1>Welcome back, {payload.username}!</h1>;
        let content = 
            <form action={logout}>
                <button type="submit">Logout</button>
            </form>;
        return <div> {title} {content} </div>
    }
}