"use client"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";

import AuthenticationButton from "./AuthenticationButton";

export default function Main() {
    const { data: session, status } = useSession();
    console.log("Session:", session);
    if(session){
        return (
        <main className="border">
            <h1>EventJar (Signed In)</h1>
            <AuthenticationButton />
    
            <Link href={`/authors`}>Authors</Link>
            <Link href={`/books`}>Books</Link>
        </main>
        )
    } else {
        return (
            <main className="border">
                <h1>EventJar (Not Signed In)</h1>
                <AuthenticationButton />
        
                <Link href={`/authors`}>Authors</Link>
                <Link href={`/books`}>Books</Link>
            </main>
        )
    }
}