"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { useSession } from "next-auth/react"
import { TbEye, TbEyeClosed  } from "react-icons/tb";


export default function SignUpPage() {
  const { data: session, status } = useSession();
  // console.log("Session: ", session);
  const router = useRouter();
  useEffect(() => {
    console.log("Session: ", session, "Status: ", status);
    if(status == "authenticated"){
      router.push('/');
    }
  }, [status]);

  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("john@host.com");
  const [password, setPassword] = useState("is442project");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name == "username") {
      setUsername(event.target.value);
    } else if (event.target.name == "password") {
      setPassword(event.target.value);
    } else if (event.target.name == "name") {
      setName(event.target.value);
    }
  };

  const createUser = async () => {
    const jsonData = {
      email: username,
      password: password,
      name: name,
    };

    // console.log(jsonData);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
      const responseData = await response.json();
      console.log("Response:", responseData);
      router.push('/auth/signin');
    } catch (error) {
      // TODO: show feedback, error message
      console.error("Error:", error);
    }
  };
  
  if(status!="authenticated"){
    return (
      <main className="mt-[5.5rem]">
        <div className="bg-white w-fit h-fit mx-auto mt-14 shadow-lg">
          <div className="bg-pri-500 px-4 py-4">
            <h2 className="text-center text-white text-lg italic font-bold">
              IS442 - Ticketing System
            </h2>
          </div>
          <div className="px-3 pt-2 mb-4" id='form'>
            <div>
              <label>
                Name
                <input
                  className="w-full py-1 pl-1 border border-slate-500 rounded-sm focus:outline-pri-500"
                  name="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={handleInputChange}
                  type="text"
                  autoComplete="off"
                />
              </label>
            </div>
            <div className="mt-2">
              <label>
                Username
                <input
                  className="w-full py-1 pl-1 border border-slate-500 rounded-sm focus:outline-pri-500"
                  name="username"
                  placeholder="name@host.com"
                  value={username}
                  onChange={handleInputChange}
                  type="text"
                  autoComplete="off"
                />
              </label>
            </div>
            <div className="mt-2">
              <label>
                  Password
                  <div className="relative block">
                    <input
                      className="block w-full py-1 pl-1 border border-slate-500 rounded-sm focus:outline-pri-500"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={handleInputChange}
                      type={showPassword ? 'text' : 'password'}
                    />
                    <button 
                      className="absolute inset-y-0 right-0 py-1 flex items-center pr-3 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <TbEyeClosed className="hover:text-pri-500" size={20}/> : <TbEye className="hover:text-pri-500" size={20}/>}
                    </button>
                  </div>
              </label>
            </div>
            <div className="w-full mt-6">
              <button
                className="w-full px-4 py-2 bg-pri-500 text-white rounded-md hover:bg-pri-700 transition-all duration-200 ease-out"
                onClick={createUser}
              >
                Sign Up
              </button>
            </div>
            <div className="text-center text-sm py-4">
              <p>
                Already have an account?{" "}
                <Link
                  href={`./signin`}
                  className="text-pri-500 hover:text-black hover:underline transition-all duration-200 ease-out"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
