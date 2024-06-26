"use client"

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function AuthenticationButton() {
    const { data: session, status } = useSession();
    console.log("Client session1:", session);

    if(session){
        return(
            <button 
                onClick={()=>{signOut()}}
                className="px-4 py-2 bg-pri-500 text-white rounded-md"
            >
                Sign Out
            </button>
        )
    } else {
        return(
            <button 
                onClick={()=>{signIn()}}
                className="px-4 py-2 bg-pri-500 text-white rounded-md"
            >
                Sign In
            </button>
        )
    }
}   