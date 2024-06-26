"use client";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";

import { TbEye, TbEyeClosed } from "react-icons/tb";
import { toast, Toaster } from "sonner";

export function CreateNewTO() {
    const [name, setName] = useState("John Doe");
    const [username, setUsername] = useState("john@host.com");
    const [password, setPassword] = useState("12345");
    const [showPassword, setShowPassword] = useState(false);
    const [isValidForm, setIsValidForm] = useState(false);

    useEffect(() => {
        setIsValidForm(name != "" && username != "" && password != "");
    }, [name, username, password]);

  useEffect(() => {
    setIsValidForm(name != "" && username != "" && password != "");
  }, [name, username, password]);

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

  const createTicketingOfficer = async () => {
      const jsonData = {
        email: username,
        name: name,
        password: password,
      };

      console.log("New Ticketing Officer:", jsonData); // Log the request data for debugging

      try {
      const response = await fetch("/api/auth/create/ticketingOfficer", {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData)
      });
      const responseData = await response.json();
      toast.success("Ticketing Officer has been created", {
          description:
          "Ticketing Officer - " + responseData.data.user.name + " (" + responseData.data.user.email + ")" + " - has been created successfully.",
          // action: {
          //   label: "View",
          //   onClick: () => {router.push(`/event/view/${data.eventID}`)},
          // },
      });
      // console.log("Response:", responseData);
      // console.log("User: ", responseData.data.user);
      } catch (error) {
      console.log(error)
      console.error("Error:", error);
        }
  };
  return (
    <div className="h-full flex-col">
        <div className="text-slate-700">
            <h2 className="text-lg font-medium tracking-tight">Ticketing Officer</h2>
            <p className="text-md text-slate-400 font-light tracking-tighter -mt-1.5">Create a new Ticketing Officer Account</p>
        </div>
        <div className="mt-1" id='form'>
            <div>
                <label className="text-sm text-slate-600 font-medium tracking-tight">
                    Name
                    <input
                        className="w-full text-sm text-black font-light tracking-tighter pl-1 pb-0.5 border-b border-b-slate-500 focus:outline-pri-500"
                        name="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={handleInputChange}
                        type="text"
                        autoComplete="off"
                    />
                </label>
            </div>
            <div className="mt-1">
                <label className="text-sm text-slate-600 font-medium tracking-tight">
                    Username
                    <input
                        className="w-full text-sm text-black font-light tracking-tighter pl-1 pb-0.5 border-b border-b-slate-500 focus:outline-pri-500"
                        name="username"
                        placeholder="name@host.com"
                        value={username}
                        onChange={handleInputChange}
                        type="text"
                        autoComplete="off"
                    />
                </label>
            </div>
            <div className="mt-1">
                <label className="text-sm text-slate-600 font-medium tracking-tight">
                    Password
                    <div className="relative block">
                        <input
                            className="block w-full text-sm text-black font-light tracking-tighter pl-1 pb-0.5 border-b border-b-slate-500 focus:outline-pri-500"
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
            <div className="w-full mt-2.5">
                {
                    isValidForm ? 
                    <button
                        className="py-3 w-full text-slate-600 font-medium border border-slate-400 border-b-4 border-r-4 border-b-slate-400 border-r-slate-400  hover:border-pri-500 bg-white hover:text-pri-500 hover:-translate-y-1 hover:-translate-x-1 shadow-md rounded-md transition-all duration-150 ease-in-out"
                        onClick={createTicketingOfficer}
                    >
                        Create User
                    </button> :
                    <button 
                        className="py-3 w-full text-slate-400/70 font-medium border border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 bg-slate-100/50 shadow-md rounded-md cursor-not-allowed" type="submit" disabled
                    >
                        Create User
                    </button>
                }
                
            </div>
        </div>
        
        <Toaster position="bottom-right" />
    </div>
  );
}

