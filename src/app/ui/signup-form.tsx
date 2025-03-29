//'use client'
import { signup } from '@/app/actions/auth'
//import { useActionState } from 'react'
 
export function SignupForm() {
    //const [state, action, pending] = useActionState(signup, undefined)
    return (
        <form action={signup}>
        {/*<form action={action}>*/}
            <div>
                <label htmlFor="username">User name: </label>
                <input id="username" name="username" placeholder="at least 2 characters" />
                {/*{state?.errors?.username && <p>{state.errors.username}</p>}*/}
            </div>
            
            <div>
                <label htmlFor="password">Password: </label>
                <input id="password" name="password" placeholder="at least 4 characters" />
                {/*{state?.errors?.password && <p>{state.errors.password}</p>}*/}
            </div>
            
            <button type="submit">Sign-up</button>
            {/*<button disabled={pending} type="submit">Login/Sign-up</button>*/}
        </form>
    );
}