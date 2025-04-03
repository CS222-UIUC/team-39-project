// from https://react.dev/learn
"use client";
import { SignupForm } from '@/app/ui/signup-form'
import { redirect } from 'next/navigation'

//https://react.dev/reference/react-dom/components/input
export default function Page() {
    function LoginPageButton() {
        function handleClick() {
            redirect('/login')
        }
        return (
          <button onClick={handleClick}>Click here for logging in instead</button>
        );
    }
    return (
        <div>
            <h1>Please sign-up</h1>
            <LoginPageButton />
            <SignupForm />
        </div>
    );
}