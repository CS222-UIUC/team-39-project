// from https://react.dev/learn
import { LoginForm } from '@/app/ui/login-form'
import { redirect } from 'next/navigation'

//https://react.dev/reference/react-dom/components/input
export default function Page() {
    function SignupPageButton() {
        function handleClick() {
            redirect('/signup')
        }
        return (
          <button onClick={handleClick}>Click here for signing up instead</button>
        );
    }
    
    return (
        <div>
            <h1>Please login</h1>
            <SignupPageButton />
            <LoginForm />
        </div>
    );
}