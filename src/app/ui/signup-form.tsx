'use client' // Required for state handling
import { useState } from 'react';
import { signup } from '@/app/actions/auth';

export function SignupForm() {
    const [error, setError] = useState<string | null>(null);

    return (
        <form action={async (formData) => {
            setError(null); // Clear previous errors
            const result = await signup(formData);
            if (result?.errors?.general) {
                setError(result.errors.general);
            }
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
            
            <button type="submit">Sign up</button>
        </form>
    );
}