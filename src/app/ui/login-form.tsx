'use client' // Required for state handling
import { useState } from 'react';
import { login } from '@/app/actions/auth';
import ReactiveButton from 'reactive-button';
// https://github.com/arifszn/reactive-button

export function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [state, setState] = useState('idle');

    return (
        <form action={async (formData) => {
            setState('loading');
            setError(null); // Clear previous errors
            const result = await login(formData);
            if (result?.errors) {
                setState('error');
                if ('general' in result.errors) 
                    setError(result.errors.general);
                else
                    setError('An unknown error occurred.');
            }
            else setState('success');
        }}>
            <main className="flex flex-col gap-[5px] items-center">
                <div>
                    <label htmlFor="username" className="text-xl">Username: </label>
                    <input className="text-lg" id="username" name="username" placeholder="at least 2 characters" required minLength={2} />
                </div>
                
                <div>
                    <label htmlFor="password" className="text-xl">Password: </label>
                    <input className="text-lg" id="password" name="password" type="password" placeholder="at least 4 characters" required minLength={4} />
                </div>
                
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
                
                <ReactiveButton 
                    buttonState={state}
                    type="submit" 
                    color="violet" 
                    idleText="Login" 
                    loadingText="Wait up to 1min"
                    successText="Redirecting"
                    errorText="Try again"
                    messageDuration={3000}
                />
            </main>
        </form>
    );
}