import Link from "next/link"
import { getServerSession } from "next-auth";

import AuthenticationButton from "./AuthenticationButton";
import { authOptions } from "@/lib/auth";

export default async function Home() {
    const session = await getServerSession(authOptions);
    console.log("Server Session:", session);
        if(session){
        return (
        <main>
            <h1>EventJar (Signed In)</h1>
            <AuthenticationButton />
            <Link href={`/authors`}>Authors</Link>
            <Link href={`/books`}>Books</Link>
        </main>
        )
    } else {
        return (
            <main>
                <h1>EventJar (Not Signed In)</h1>
                <AuthenticationButton />
                <Link href={`/authors`}>Authors</Link>
                <Link href={`/books`}>Books</Link>
            </main>
        )
    }
}
