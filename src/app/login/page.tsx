import Image from "next/image";

function LoginButton() {
    return (
      <button>I'm a login button</button>
    );
}

export default function Page() {
    return (
        <div>
            <h1>This is our login page</h1>
            <LoginButton />
        </div>
    )
}