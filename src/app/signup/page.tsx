// from https://react.dev/learn
"use client";
import { SignupForm } from '@/app/ui/signup-form'
import { redirect } from 'next/navigation'
import ReactiveButton from 'reactive-button';

//https://react.dev/reference/react-dom/components/input
export default function Page() {
    function LoginPageButton() {
        function handleClick() {
            redirect('/login')
        }
        return (
            <ReactiveButton onClick={handleClick} color="violet" idleText="Click here for logging in instead" />
        );
    }
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[10px] row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-semibold text-center">Please sign up</h1>
                <LoginPageButton />
                <SignupForm />
            </main>
        </div>
    );
}