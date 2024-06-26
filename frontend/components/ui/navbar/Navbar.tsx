"use client"

import Link from "next/link"

import type { Session } from 'next-auth'; 
import { LuUserCircle2 } from "react-icons/lu";
import { useEffect } from "react";

import UserMenu from "./UserMenu";

export default function Navbar(session : {"session":  Session | null}) {
    // console.log("Navbar session: ", session);
    const userRole = session.session?.user?.role as string;

    if(userRole == "Event Manager") {
        return (
            <nav className="bg-gradient-to-r from-pri-500 via-pri-500 to-[#F34E7B] shadow-lg md:rounded-b-3xl inset-x-0 h-[4.5rem] sticky top-0 z-50">
                <div className="px-4 flex justify-between items-center h-[4.5rem]">
                    <div className="flex items-center space-x-4 cursor-default">
                        <Link className="pl-6 flex space-x-2 items-center cursor-default" href="#">
                            {/* <FlagIcon className="h-6 w-6" /> */}
                            <span className="text-lg text-white font-semibold">IS442</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link className="relative font-medium hover:underline hover:underline-offset-8 text-white rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/">
                            Home
                        </Link>
                        <Link className="font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/eventshub">
                            Events
                        </Link> 
                        <Link className="font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/dashboard">
                            Dashboard
                        </Link>
                        {/* <Link className="font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/eventshub">
                            Events
                        </Link> */}
                        
                        <div className="flex items-center font-medium text-white rounded-lg px-3 py-2 transition duration-200 ease-in-out">
                            { session.session == null ? 
                                (
                                    <Link href='/auth/signin' className='flex items-center ml-2'>
                                        <LuUserCircle2 className="mr-1.5" size="25" />
                                        Sign In / Register
                                    </Link>
                                ):
                                (
                                    <UserMenu session={session.session} />
                                )
                            }
                        </div>
                    </div>
                </div>
            </nav>
        )
    } else if(userRole == "Ticketing Officer") {
        return (
            <nav className="bg-gradient-to-r from-pri-500 via-pri-500 to-[#F34E7B] shadow-lg md:rounded-b-3xl inset-x-0 h-[4.5rem] sticky top-0 z-50">
                <div className="px-4 flex justify-between items-center h-[4.5rem]">
                    <div className="flex items-center space-x-4">
                    <Link className="pl-6 flex space-x-2 items-center" href="#">
                        {/* <FlagIcon className="h-6 w-6" /> */}
                        <span className="text-lg text-white font-semibold">IS442</span>
                    </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link className="relative font-medium hover:underline hover:underline-offset-8 text-white rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/">
                            Home
                        </Link>
                        <Link className="font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/eventshub">
                            Events
                        </Link> 
                        <Link className="font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/dashboard">
                            Dashboard
                        </Link>
                        {/* <Link className="font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/ticketshub">
                            Test Ticket Hub
                        </Link>
                        <Link className="font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/">
                            Tickets
                        </Link>*/}                        
                        <div className="flex items-center font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out">
                            { session.session == null ? 
                                (
                                    <Link href='/auth/signin' className='flex items-center ml-2'>
                                        <LuUserCircle2 className="mr-1.5" size="25" />
                                        Sign In / Register
                                    </Link>
                                ):
                                (
                                    <UserMenu session={session.session} />
                                )
                            }
                        </div>
                    </div>
                </div>
            </nav>
        )
    } else {
        return (
            <nav className="bg-gradient-to-r from-pri-500 via-pri-500 to-[#F34E7B] shadow-lg md:rounded-b-3xl inset-x-0 h-[4.5rem] sticky top-0 z-50">
                <div className="px-4 flex justify-between items-center h-[4.5rem]">
                    <div className="flex items-center space-x-4">
                    <Link className="pl-6 flex space-x-2 items-center" href="#">
                        {/* <FlagIcon className="h-6 w-6" /> */}
                        <span className="text-lg text-white font-semibold">IS442</span>
                    </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link className="font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/">
                            Home
                        </Link>
                        <Link className="font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/eventshub">
                            Events
                        </Link>
                        
                        <div className="flex items-center font-medium text-white hover:underline hover:underline-offset-8 rounded-lg px-3 py-2 transition duration-200 ease-in-out">
                            { session.session == null ? 
                                (
                                    <Link href='/auth/signin' className='flex items-center ml-2'>
                                        <LuUserCircle2 className="mr-1.5" size="25" />
                                        Sign In / Register
                                    </Link>
                                ):
                                (
                                    <UserMenu session={session.session} />
                                )
                            }
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}