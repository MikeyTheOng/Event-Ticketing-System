"use client"

import type { Booking } from "@/lib/api/types";
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"

import { IoIosStar } from "react-icons/io";
import { MdInfoOutline } from "react-icons/md";
import { API_URL } from "@/lib/api";

function formatDateDDMMYY(inputDate: string): string {
  const date = new Date(inputDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month starts from 0
  const year = date.getFullYear();

  // Pad day and month with leading zeros if needed
  const formattedDay = day.toString().padStart(2, '0');
  const formattedMonth = month.toString().padStart(2, '0'); // Corrected this line

  return `${formattedDay}/${formattedMonth}/${year % 100}`;
}

function fomratDateTicketDisplayFormat(inputDate: string): string {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const date = new Date(inputDate);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = monthsOfYear[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  // Convert hours from 24-hour format to 12-hour format
  if (hours > 12) {
      hours -= 12;
  } else if (hours === 0) {
      hours = 12;
  }

  return `${dayOfWeek} — ${month} ${day} ${year} ${hours}:${minutes.toString().padStart(2, '0')}${ampm}`;
}

export function BookingCard({booking, key}: {booking: Booking, key: React.Key}) {
  const router = useRouter()
  const { data: session } = useSession();
  let totalNumOfGuests = 0;
  for(const ticket of booking.ticketList) {
    totalNumOfGuests += ticket.numGuest;
  }

  const handleCancelBooking = async () => {
    const url = `${API_URL}/booking/${booking.bookingID}/cancel`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${session?.user?.token}`,
        }
      });
      const data = await response.json();
      console.log("Data:", data);
      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      toast.success("Event has been Updated", {
        description:  "Booking cancelled successfully",
        // action: {
        //   label: "View",
        //   onClick: () => {router.push(`/event/view/${data.eventID}`)},
        // },
      });
      
      console.log('Booking cancelled successfully');
      window.scrollTo({ top: 0 });
      router.refresh();
    } catch (error : any) {
      console.error('Error cancelling booking:', error.message);
    }
  }

  function is48HoursBefore(startTime : string) {
    // Convert the event start time to a Date object
    const eventStartTime = new Date(startTime);
  
    // Get the current time
    const currentTime = new Date();
  
    // Calculate the difference between the current time and the event start time in milliseconds
    const timeDifference = eventStartTime.getTime() - currentTime.getTime();
  
    // Calculate the number of hours difference
    const hoursDifference = timeDifference / (1000 * 3600);
  
    // Return true if the difference is at least 48 hours, otherwise return false
    if (hoursDifference <= 48){
      return true; 
    } else {
      return false;
    }
  }

  return (
    <div className="bg-white  grid grid-cols-12 min-h-[16rem] mb-4 relative border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 shadow-md rounded-r-xl rounded-l-sm">
      <div className="col-span-1 flex flex-col justify-between gap-4 bg-pri-500 text-white rounded-l-sm px-4 py-4 border-r-[6px] border-r-pri-300"        
        id="booking-details"
      >
        <div>
          <p className="text-sm font-light tracking-tighter">BOOKING ID</p>
          <p className="text-lg font-medium">{ booking.bookingID }</p>
          <p className="text-sm font-light tracking-tighter">EVENT ID</p>
          <p className="text-lg font-medium">{ booking.bookingID }</p>
        </div>
        <div>
          {/* <p className="text-sm font-light tracking-tight">BOOKING ID</p> */}
          <p className="text-md font-medium tracking-tighter">{ formatDateDDMMYY(booking.event.startTime) }</p>
        </div>
      </div>
      <div className="col-span-4 bg-contain bg-no-repeat"
        // style={{ backgroundImage: `url(${booking.event.thumbnail})`
        //   // height: '100vh',
        // }}
      >
        <img className="h-full w-full object-fill" src={booking.event.thumbnail} alt={booking.event.eventName} />
      </div>
      <div className="col-span-6 py-6 pl-4 pr-10"
        id="event-details"
      >
        <div className="flex gap-4 h-full">
          <div className="h-full flex flex-col justify-center gap-4"><IoIosStar size={17}/><IoIosStar size={17}/><IoIosStar size={17}/><IoIosStar size={17}/><IoIosStar size={17}/><IoIosStar size={17}/></div>
          <div>
            <h4 className="text-wrap text-slate-700 text-xl lg:text-xl xl:text-2xl font-medium tracking-tight">{ booking.event.eventName.toUpperCase() }</h4>
            <div className="mt-1">
              <p className="text-wrap text-slate-500 text-sm lg:text-lg">LIVE AT <span className="text-slate-700 font-medium text-lg">{ booking.event.venue.toUpperCase() }</span></p>
              <p className="text-wrap text-slate-600 font-medium tracking-wide text-sm lg:text-md"> { fomratDateTicketDisplayFormat(booking.event.startTime).toUpperCase() }</p>
            </div>
            {
              booking.bookingStatus == "Active" ? 
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className="bg-emerald-300 hover:bg-emerald-400 cursor-default tracking-wide text-sm lg:text-xs" variant="outline">Upcoming <MdInfoOutline className="font-light" size={14}/></Badge> 
                    </TooltipTrigger>
                    <TooltipContent className="bg-emerald-400 max-w-[12rem] text-center">
                      Upcoming event!
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              : booking.bookingStatus == "Cancelled" ? 
                <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-red-200 hover:bg-red-300 text-red-500 cursor-default tracking-wide text-sm lg:text-xs">Cancelled / Refunded <MdInfoOutline className="font-light" size={14}/></Badge> 
                  </TooltipTrigger>
                  <TooltipContent className="bg-red-300 max-w-[12rem] text-center">
                    Sorry, this event/booking has been cancelled & refunded
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              : 
                <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-stone-200 hover:bg-stone-300 text-black cursor-default tracking-wide text-sm lg:text-xs" variant="outline">Passed <MdInfoOutline className="font-light" size={14}/></Badge>
                  </TooltipTrigger>
                  <TooltipContent className="bg-stone-300 max-w-[12rem] text-center">
                    This event has passed, hope you had a blast!
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>  
            }
            
          </div>
        </div>
      </div>
      <div
        className="col-span-1"
        id="status-details"
      >
        <Dialog>
          <DialogTrigger className="w-full h-full">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center h-full w-full bg-pri-500 hover:bg-pri-400 cursor-pointer rounded-r-xl">
                    <p className="[writing-mode:vertical-lr] rotate-180 text-center text-white tracking-tight">
                      NUMBER OF TICKETS: <span className="text-xl">{ booking.ticketList.length }</span> 
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Click to view ticket information
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                <div className="">
                  This booking is for { booking.ticketList.length } tickets and admits { totalNumOfGuests } guests in total.
                </div>
                <div id="tickets">
                  {
                    booking.ticketList.map((ticket, index) => {
                      return(
                        <div key={index} id="ticket-card" className="mt-4 flex py-4 px-4 border border-gray-300 rounded-lg shadow-md">
                          <div>
                            <p className="font-medium tracking-tight">Ticket ID: <span className="font-normal">{ ticket.ticketID }</span></p>
                            <p className="font-medium tracking-tight">Admits: <span className="font-normal">{ ticket.numGuest } pax</span></p>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                {
                  booking.bookingStatus == "Active" ?
                  <div className="mt-2">
                    <Dialog>
                      <DialogTrigger 
                        className="w-full bg-red-500 hover:bg-red-600  text-white px-2 py-4 rounded-xl disabled:opacity-50 disabled:hover:bg-red-500 disabled:cursor-not-allowed"
                        disabled={ is48HoursBefore(booking.event.startTime) }
                      >
                          Cancel Booking
                      </DialogTrigger>
                      <DialogContent className="max-w-[24rem]">
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            <div>
                              <p>
                                This action cannot be undone. This will permanently cancel your booking. Are you sure?
                              </p>
                              <div className="flex mt-2">
                                <DialogClose className="w-full" asChild>
                                  <button className="w-full bg-slate-500 hover:bg-slate-400 text-white px-2 py-3 rounded-lg">
                                    Go back
                                  </button>
                                </DialogClose>
                                <button className="w-full bg-red-500 hover:bg-red-600 text-white px-2 py-3 mx-1 rounded-lg"
                                  onClick={handleCancelBooking}
                                >
                                  Yes, cancel booking
                                </button>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog> 
                  </div> 
                  : null
                }
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Toaster position="bottom-right" />
      </div>
    </div>
  )
}
