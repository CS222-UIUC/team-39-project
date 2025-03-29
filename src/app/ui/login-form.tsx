import { login } from '@/app/actions/auth'
 
export function LoginForm() {
    //const [state, action, pending] = useActionState(signup, undefined)
    return (
        <form action={login}>
        {/*<form action={action}>*/}
            <div>
                <label htmlFor="username">User name: </label>
                <input id="username" name="username" placeholder="at least 2 characters" />
            </div>
            
            <div>
                <label htmlFor="password">Password: </label>
                <input id="password" name="password" placeholder="at least 4 characters" />
            </div>
            
            <button type="submit">Login</button>
        </form>
    );
}