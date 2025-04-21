'use client' // Required for state handling
import { useState } from 'react';
import { signup } from '@/app/actions/auth';
import ReactiveButton from 'reactive-button';
// https://github.com/arifszn/reactive-button

export function SignupForm() {
    const [error, setError] = useState<string | null>(null);
    const [state, setState] = useState('idle');

    return (
        <form action={async (formData) => {
            setState('loading');
            setError(null); // Clear previous errors
            const result = await signup(formData);
            if (result?.errors) {
                setState('error');
                if ('general' in result.errors) 
                    setError(result.errors.general);
                else
                    setError('An unknown error occurred.');
            }
            else setState('success');
        }}>
            <div>
                <label htmlFor="username">Username: </label>
                <input id="username" name="username" placeholder="at least 2 characters" required minLength={2} />
            </div>
            
            <div>
                <label htmlFor="password">Password: </label>
                <input id="password" name="password" type="password" placeholder="at least 4 characters" required minLength={4} />
            </div>
            
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            
            <ReactiveButton 
                buttonState={state}
                type="submit" 
                color="violet" 
                idleText="Sign up" 
                loadingText="Wait up to 1min"
                successText="Redirecting"
                errorText="Try again"
                messageDuration={3000}
            />
        </form>
    );
}