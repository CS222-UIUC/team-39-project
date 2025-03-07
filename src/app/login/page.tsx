// from https://react.dev/learn
import { SignupForm } from '@/app/ui/signup-form'

//https://react.dev/reference/react-dom/components/input
export default function Page() {
    return (
        <div>
            <h1>Please login/sign-up</h1>
            <SignupForm />
        </div>
    );
    
    //const [isLoggedIn, setIsLoggedIn] = useState(0);
    //function LogoutButton() {
    //    function handleClick() {
    //        setIsLoggedIn(0);
    //        alert('You have logged out!');
    //    }
    //    return (
    //      <button onClick={handleClick}>Logout</button>
    //    );
    //}
}