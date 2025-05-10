"use client";
import ReactiveButton from 'reactive-button';
import { redirect } from 'next/navigation'
export default function Page() {
    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1>Backend is probably not running.<br></br>If the error persists after one minute, contact hereiszory@gmail.com</h1>
            <ReactiveButton onClick={() => redirect('/login')} color="violet" idleText="Back to login page" />
        </div>
    );
}
