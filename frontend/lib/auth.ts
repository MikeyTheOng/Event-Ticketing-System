import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  // your configs{
  jwt: {},
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          // console.log("Authorize callback")
          // Add logic here to look up the user from the credentials supplied
          const username = credentials!.username
          const password = credentials!.password
          // TODO: validate with backend that user is valid
          // const user = { id: "1", name: "J Smith", email: "jsmith@example.com", userTest: "test"}
          const response = await fetch("http://localhost:3000/api/auth/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: username, password: password }),
          })
          // console.log("Authorize response")
          const data = await response.json()
          const user = data.user
          // console.log("Authorize data:", user);
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            // * this use is what is returned to the signIn callback
            return user
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          console.error("Fetch error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("signIn callback User:", user)
      if (user && "token" in user) {
        return true
      }
      // Or you can return a URL to redirect to:
      // return '/unauthorized'
      return false
    },
    async jwt({ token, account, profile, user }) {
      // console.log("JWT Callback:", account, token, user)

      // Persist the OAuth access_token and or the user id to the token right after signin
      // * This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client)
      // ! The arguments user, account, profile and isNewUser are only passed the first time this callback is called on a new session, after the user signs in. In subsequent calls, only token will be available.
      // console.log("JWT Account:", account);
      // console.log("JWT Token:", token);
      // console.log("JWT User:", user);
      if (user) {
        token.role = user.role
        token.token = user.token
      }
      return token
    },
    async session({ session, token }) {
      // console.log("session Callback:",   token, session)

      // Send properties to the client, like an access_token and user id from a provider. (exposes the token to client-side through session)
      // * The session callback is called whenever a session is checked
      // console.log("Session token:", token);
      session.user.role = token.role
      session.user.token = token.token
      // console.log("Session session:", session);
      return session

      // return {
      //     ...session,
      //     name: session.user?.name,
      //     email: session.user?.email,
      //     test: token['test'],
      //     test2: 'test'
      // }
    },
  },
}
