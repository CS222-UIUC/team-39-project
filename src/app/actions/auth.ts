"use server"
import { SignupFormSchema } from '@/app/lib/definitions'
import { createSession, deleteSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import { getEnvVariable } from '@/app/lib/config';

const LOGIN_API = getEnvVariable('LOGIN_API');
const SIGNUP_API = getEnvVariable('SIGNUP_API');

// https://nextjs.org/docs/app/building-your-application/authentication#2-validate-form-fields-on-the-server
export async function signup(formData: FormData) {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    })
    
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    
    // 2. Prepare data for insertion into database
    const { username, password } = validatedFields.data
    
    // 3. Insert the user into the database or call an Auth Library's API
    const response = await fetch(SIGNUP_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    
    if (response.status === 403)
        redirect('/403')

    if (!response.ok) {
        const errorData = await response.json();
        return { errors: { general: errorData.error } };
    }
 
    // 4. Create user session
    await createSession(username)
    
    // 5. Redirect user
    redirect('/')
}

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    
    if (response.status === 403)
        redirect('/403')

    if (!response.ok) {
        const errorData = await response.json();
        return { errors: { general: errorData.error } };
    }
 
    await createSession(username)
    redirect('/')
}
 
export async function logout() {
  deleteSession()
  redirect('/login')
}