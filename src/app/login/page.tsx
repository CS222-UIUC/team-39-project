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
    //let content = <h1>Please login, {user.name}!</h1>;
    //if (isLoggedIn) {
    //  content = 
    //    <div>
    //        <h1>Welcome back, {user.name}!</h1>
    //        <img
    //            className="avatar"
    //            src={user.imageUrl}
    //            alt={'Photo of ' + user.name}
    //            style={{
    //            width: user.imageSize,
    //            height: user.imageSize
    //            }}
    //        />
    //        <LogoutButton />
    //    </div>;
    //} else {
    //    content = 
    //        <div>
    //        </div>
    //}
    //return <div> {content} </div>
}