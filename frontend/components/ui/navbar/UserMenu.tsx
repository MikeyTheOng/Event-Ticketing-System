"Use Client"

import Link from "next/link"
import { useState } from 'react';
import { signOut } from "next-auth/react";

import { LuUserCircle2 } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";

import type { Session } from 'next-auth'; 

export default function UserMenu(session : {"session": Session | null}) {
    const [showMenu, setShowMenu] = useState(false);

    const userRole = session.session?.user?.role as string;
    if (userRole == "Event Manager") {
        return (
            <nav className="relative w-full pr-6">
                <div
                    className='flex items-center px-2 py-2 transition duration-200 ease-in-out hover:underline hover:underline-offset-8'
                    onMouseEnter={() => setShowMenu(true)}
                    onMouseLeave={() => setShowMenu(false)}
                >
                    <LuUserCircle2 className="mr-1.5" size="25" />
                    {session.session?.user.name}
                </div>
                {showMenu && (
                    <div 
                        className="w-full min-w-[12rem] py-2 absolute top-full right-0 bg-white border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 shadow-md text-center rounded-lg"
                        onMouseEnter={() => setShowMenu(true)}
                        onMouseLeave={() => setShowMenu(false)}
                        id="dropdown-menu"
                    >
                        {/* <div id="item1" className="mt-2">
                            <Link className="text-black hover:underline hover:text-pri-500 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="#">
                                Reports
                            </Link>
                        </div> */}
                        <div id="item2" className="mt-2">
                            <Link 
                                className="text-black flex items-center ml-3 hover:underline hover:text-pri-500 rounded-lg px-3 py-2 transition duration-200 ease-in-out" 
                                href="#"
                                onClick={() => {signOut({ callbackUrl: '/' })}}    
                            >
                                <LuLogOut className="mr-1.5 hover:underline flex" size="17" />
                                Sign Out
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        )

    } else if (userRole == "Ticketing Officer") {
        return (
            <nav className="relative w-full pr-6">
                <div
                    className='flex items-center px-2 py-2 transition duration-200 ease-in-out hover:underline hover:underline-offset-8'
                    onMouseEnter={() => setShowMenu(true)}
                    onMouseLeave={() => setShowMenu(false)}
                >
                    <LuUserCircle2 className="mr-1.5" size="25" />
                    {session.session?.user.name}
                </div>
                {showMenu && (
                    <div 
                        className="w-full min-w-[12rem] absolute top-full right-0 bg-white border-1.5 border-gray-300 border-t-4 border-t-gray-300 p-4 rounded-md text-center shadow-lg"
                        onMouseEnter={() => setShowMenu(true)}
                        onMouseLeave={() => setShowMenu(false)}
                        id="dropdown-menu"
                    >
                        {/* <div id="item1" className="mt-2">
                            <Link className="text-black hover:underline hover:text-pri-500 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="#">
                                Tickets
                            </Link>
                        </div> */}
                        <div id="item2" className="mt-2">
                            <Link 
                                className="text-black flex items-center ml-3 hover:underline hover:text-pri-500 rounded-lg px-3 py-2 transition duration-200 ease-in-out" 
                                href="#"
                                onClick={() => {signOut({ callbackUrl: '/' })}}    
                            >
                                <LuLogOut className="mr-1.5 hover:underline flex" size="17" />
                                Sign Out
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        )
    } else {
        return (
            <nav className="relative w-full pr-6">
                <div
                    className='flex items-center px-2 py-2 transition duration-200 ease-in-out hover:underline hover:underline-offset-8'
                    onMouseEnter={() => setShowMenu(true)}
                    onMouseLeave={() => setShowMenu(false)}
                >
                    <LuUserCircle2 className="mr-1.5" size="25" />
                    {session.session?.user.name}
                </div>
                {showMenu && (
                    <div 
                        className="w-full min-w-[12rem] absolute top-full right-0 bg-white border-1.5 border-gray-300 border-t-4 border-t-gray-300 p-4 rounded-md text-center shadow-lg"
                        onMouseEnter={() => setShowMenu(true)}
                        onMouseLeave={() => setShowMenu(false)}
                        id="dropdown-menu"
                    >
                        <div id="item1" className="mt-2">
                            <Link className="text-black hover:underline hover:text-pri-500 rounded-lg px-3 py-2 transition duration-200 ease-in-out" href="/account">
                                My Account
                            </Link>
                        </div>
                        <div id="item2" className="mt-2">
                            <Link 
                                className="text-black flex items-center ml-3 hover:underline hover:text-pri-500 rounded-lg px-3 py-2 transition duration-200 ease-in-out" 
                                href="#"
                                onClick={() => {signOut({ callbackUrl: '/' })}}    
                            >
                                <LuLogOut className="mr-1.5 hover:underline flex" size="17" />
                                Sign Out
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        )
    }
}

