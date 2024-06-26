"use client"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { getCsrfToken } from "next-auth/react"
import { signIn, useSession } from "next-auth/react"
import Image from "next/image"


export default function SignIn() {const { data: session, status } = useSession();
  // console.log("Session: ", session);
  const router = useRouter();
  useEffect(() => {
    console.log("Session: ", session, "Status: ", status);
    if(status == "authenticated"){
      router.push('/');
    }
  }, [status]);

  const [csrfToken, setCsrfToken] = useState<string>("");
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const token = await getCsrfToken();
        setCsrfToken(token as string);
        console.log("csrfToken", token);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const currentUrl = window.location.href;
  const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
  let callbackUrl;
  if (urlParams.has('callbackurl')) {
    // Get the value of the 'callbackurl' parameter
    callbackUrl = urlParams.get('callbackurl');
    // Do whatever you need with the callbackUrl value
    console.log(callbackUrl);
  } else {
    // Handle the case where the 'callbackurl' parameter is not present
    console.log("No 'callbackurl' parameter found in the URL.");
  }
  const [username, setUsername] = useState("jordan@gmail.com");
  const [password, setPassword] = useState("is442project");

  const handleInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.name == "username"){
      setUsername(event.target.value);
    } else if (event.target.name == "password"){
      setPassword(event.target.value);
    }
  }
  if(status!="authenticated"){
    return (
      <main className="mt-[5.5rem]">
        <div className="bg-white w-fit h-fit mx-auto mt-14 shadow-lg">
          <div className="bg-pri-500 px-4 py-4">
            <h2 className="text-center text-white text-lg italic font-bold">IS442 - Ticketing System</h2>
          </div>
          <form method="post" action="/api/auth/callback/credentials">
            <div className="px-3 pt-2 mb-4">
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div>
                <label>
                  Username
                  <input 
                    name="username" 
                    type="text" 
                    value={username}
                    onChange={handleInputChange}
                    placeholder="name@host.com" 
                    autoComplete="off"
                    className="w-full py-1 pl-1 border border-slate-500 rounded-sm focus:outline-pri-500"
                  />
                </label>
              </div>
              <div className="mt-2">
                <label>
                  Password
                  <input 
                    name="password" 
                    type="password" 
                    value={password}
                    onChange={handleInputChange}
                    placeholder="Password" 
                    className="w-full py-1 pl-1 border border-slate-500 rounded-sm focus:outline-pri-500" 
                  />
                </label>
              </div>
              <div className="w-full mt-6">
                <button 
                  onClick={() => signIn("credentials", { redirect: false, username: username, password: password})}
                  className="w-full px-4 py-2 bg-pri-500 text-white rounded-md hover:bg-pri-700 transition-all duration-200 ease-out" 
                >
                  Sign in
                </button>
                
              </div>
              <div className="text-center text-sm py-4">
                <p>Need an account? <Link href={`./signup`} className="text-pri-500 hover:text-black hover:underline transition-all duration-200 ease-out">Sign Up</Link></p> 
              </div>
            </div>
          </form>
        </div>
      </main>
    )
  }
}