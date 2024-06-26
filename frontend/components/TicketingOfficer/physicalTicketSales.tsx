"use client"
import { Event } from "@/lib/api/types";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

import { TicketCard } from "./ticketCard";

import { toast, Toaster } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"

export function PhysicalTicketSales() {
    const fetchEventData = async () => { // retrieve events from spring
        try {
            const response = await fetch(`http://127.0.0.1:8080/event`, { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                // console.log("Fetched Event Data:", data);
                const currentTime = new Date();
                const activeEvents = data.filter((event : Event) => {
                    return !event.cancelled && currentTime < new Date(event.startTime) ;
                })
                // console.log("activeEvents:", activeEvents);
                setEventsArr(activeEvents);
                // return data;
        } else {
            console.error("fetchData error: response")
            throw new Error("Failed to perform server action");
        }
        } catch (error) {
            console.error(error);
        }
    }


    const [eventsArr, setEventsArr] = useState<Event[]>([]);
    const [selectedEventID, setSelectedEventID] = useState<number | string>("Select an Event");
    const { data: session, status } = useSession();
    useEffect(() => {
        console.log("Session:", session)
        if(session?.user?.email){
            setUserEmail(session.user.email);
        }
    })
    const [userEmail, setUserEmail] = useState('');
    const [numTickets, setNumTickets] = useState(1);
    const [ticketList, setTicketList] = useState([1]);
    const [isValidForm, setIsValidForm] = useState(false);

    useEffect(() => {
        if (selectedEventID !== "Select an Event" && userEmail !== '') {
            setIsValidForm(true);
        } else {
            setIsValidForm(false);
        }
    }, [selectedEventID, userEmail]);

    useEffect(() => {
        fetchEventData();
    }, [])

    const handleUpdateTicket = (index: number, newNumGuests: number) => {
        if (newNumGuests >= 1 && newNumGuests <= 4) {
            ticketList[index] = newNumGuests;
            setTicketList([...ticketList]);
        }
    }
    const isIncreaseTickets = (newNumOfTickets: number) => {
        if(newNumOfTickets - numTickets > 0){
            return true;
        } else {
            return false;
        }
    }
    const updateNumTickets = (isIncrease: boolean, newNumOfTickets: number) => {
        if(isIncrease){
            setTicketList([...ticketList, 1]);
        } else {
            setTicketList(ticketList.slice(0, ticketList.length - 1));
        }
        setNumTickets(newNumOfTickets)
    }
    const handleChangeTickets = (newNumOfTickets : number) => {
        if(newNumOfTickets >= 1 && newNumOfTickets <= 12){
            updateNumTickets( isIncreaseTickets(newNumOfTickets), newNumOfTickets);
        }
    }

    const createBooking = async () => {
        try{
            const response = await fetch(`/api/booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventID: selectedEventID,
                    ticketList: ticketList,
                    bookerEmail: userEmail
                })
            });

            if (response.status == 201){
                const data = await response.json();
                setUserEmail('');
                setNumTickets(1);
                console.log("Booking created:", data);
                toast.success("Booking Created Successfully", {
                    description:  "Booking has been created for " + userEmail,
                });
            } else {
                console.log("Error:", response)
            }
        } catch (error) {
            console.error(error);
        }
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createBooking();
    }

    if ( eventsArr.length > 0) {
        return (
            <div className=''>
                <div className="rounded-t-lg">
                    <h2 className="text-3xl text-slate-700 font-bold mb-1">On-site Ticket Sales</h2>
                    <div className="w-[50px] border-2 border-slate-700"></div>
                </div>
                <form className='mt-4' onSubmit={(e) => handleSubmit(e)}>
                    <div className="mt-2.5">
                        <label className="text-slate-600 font-medium tracking-tighter">
                            Select Event:
                            <Select value={String(selectedEventID)} onValueChange={(value) => setSelectedEventID(Number(value))}>
                                <SelectTrigger className="text-slate-600 font-medium tracking-tighter w-full border-t-0 border-l-0 border-r-0 border-b-slate-500 rounded-none">
                                    <SelectValue placeholder="Verify" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Events</SelectLabel>
                                        {
                                            eventsArr.map((event, index) => {
                                                return (
                                                    <SelectItem key={index} value={String(event.eventID)} className="text-slate-500 tracking-tighter">{event.eventName}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </label>
                    </div>             
                    <div id="tickets" className={`mt-4 ${selectedEventID === "Select an Event" ? "hidden" : "block"}`}>
                        <div className="rounded-t-lg">
                            <h2 className="text-lg text-slate-700 font-bold mb-1">Tickets</h2>
                            <div className="w-[50px] border-2 border-slate-700"></div>  
                        </div>
                        <div className="flex items-center gap-1">
                            Number of Tickets:
                            <input
                                className="w-[3rem] text-xl text-black text-center font-light tracking-tighter py-1.5 pb-0.5 border border-slate-500 focus:outline-pri-500 rounded-lg"
                                name="name"
                                placeholder="1"
                                value={numTickets}
                                onChange={(e)=>{handleChangeTickets(Number(e.target.value))}}
                                type="number"
                                autoComplete="off"
                                min={1}
                                onKeyDown={(e) => {e.preventDefault();}}
                            />
                        </div>
                        <div className="mt-2.5 grid grid-cols-3 gap-4">
                            {Array.from({ length: numTickets }).map((_, index) => (
                                <div key={index}>
                                    <TicketCard index={index} handleUpdateTicket={handleUpdateTicket}/>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2.5">
                            {
                                isValidForm ? 
                                    <button 
                                        className="py-3 w-full text-slate-600 font-medium border border-slate-400 border-b-4 border-r-4 border-b-slate-400 border-r-slate-400  hover:border-pri-500 bg-white hover:text-pri-500 hover:-translate-y-1 hover:-translate-x-1 shadow-md rounded-md transition-all duration-150 ease-in-out" type="submit" 
                                    >
                                        Issue Tickets
                                    </button>
                                :
                                <button 
                                    className="py-3 w-full text-slate-400/70 font-medium border border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 bg-slate-100/50 shadow-md rounded-md cursor-not-allowed" type="submit" disabled
                                >
                                    Issue Tickets
                                </button>
                            }
                        </div>
                    </div>
                </form>
                <Toaster position="bottom-right" />
            </div>
        )
    }
}