import NextAuth,{ DefaultSession } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

export declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            // ...
            bal: number
            role: string
            token: string
        } & DefaultSession["user"]
    }

    
    interface User {
        role: string
        bal: number
        token: string
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        role: string
        token: string
        // test1: string,
        // test2: string
    }
}
