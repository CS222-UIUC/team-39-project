// from https://react.dev/learn
'use client'
import { useState } from 'react';

const user = {
    name: 'Hedy Lamarr',
    imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
    imageSize: 90,
};

export default function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(1);
    function LogoutButton() {
        function handleClick() {
            setIsLoggedIn(0);
            alert('You have logged out!');
        }
          
        return (
          <button onClick={handleClick}>Logout</button>
        );
    }
    let content = <h1>Please login, {user.name}!</h1>;
    if (isLoggedIn) {
      content = 
        <div>
            <h1>Welcome back, {user.name}!</h1>
            <img
                className="avatar"
                src={user.imageUrl}
                alt={'Photo of ' + user.name}
                style={{
                width: user.imageSize,
                height: user.imageSize
                }}
            />
            <LogoutButton />
        </div>;
    } else {
        content = <h1>Please login, {user.name}!</h1>;
    }
    return <div> {content} </div>
}