"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CreateNewBookingCard } from "@/components/CreateNewBookingCard";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/api";

export default function CreateBooking({
  params,
}: {
  params: { eventData: string };
}) {
  const { data: session, status } = useSession();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Parse the eventData string back to an object
  const eventData = JSON.parse(decodeURIComponent(params.eventData));
  console.log("Event Data: ", eventData);

  //LOGIC FOR ADDING TICKETS AND GUESTS
  const [numTickets, setNumTickets] = useState(1);
  const [ticketList, setTicketList] = useState([1]);
  const totalPrice = eventData.price * ticketList.reduce((a, b) => a + b, 0)
  //The data that we need to submit the stuff
  const handleUpdateTicket = (index: number, newNumGuests: number) => {
    if (newNumGuests >= 1 && newNumGuests <= 4) {
      ticketList[index] = newNumGuests;
      setTicketList([...ticketList]);
    }
  };
  const isIncreaseTickets = (newNumOfTickets: number) => {
    if (newNumOfTickets - numTickets > 0) {
      return true;
    } else {
      return false;
    }
  };
  const updateNumTickets = (isIncrease: boolean, newNumOfTickets: number) => {
    if (isIncrease) {
      setTicketList([...ticketList, 1]);
    } else {
      setTicketList(ticketList.slice(0, ticketList.length - 1));
    }
    setNumTickets(newNumOfTickets);
  };
  const handleChangeTickets = (newNumOfTickets: number) => {
    if (newNumOfTickets >= 1 && newNumOfTickets <= 12) {
      updateNumTickets(isIncreaseTickets(newNumOfTickets), newNumOfTickets);
    }
  };

  interface BookingRequestDTO {
    eventID: number;
    ticketList: number[];
    bookerEmail?: string | null;
    bookerPW: string;
  }

  const handleBuyTickets = () => {
    const bookingRequest: BookingRequestDTO = {
      eventID: eventData.eventID,
      ticketList: ticketList,
      bookerEmail: session?.user.email, // Replace with your booker's email
      bookerPW: password,
    };

    const authToken = session?.user.token;
    setLoading(true);
    fetch(`${API_URL}/booking/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookingRequest),
    })
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          throw new Error("Failed to create booking");
        }
      })
      .then((data) => {
        toast.success("Booking has been created successfully", {
          action: {
            label: "View",
            onClick: () => {
              router.push(`/account`);
            },
          },
        });
        setTimeout(() => {
          router.push(`/account`);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error creating booking:", error);
        toast.error("Booking failed. Please try again", {});
      });
  };

  function formatDatetime(isoDatetime: string): string {
    const date = new Date(isoDatetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  if (status == "authenticated" && session?.user?.role == "Customer") {
    return (
      <main className="mt-4 mb-2.5 mx-12 lg:mx-[12rem] 2xl:mx-[28rem]">
          <div className="pt-[2rem] py-[4rem] p-12 flex-col bg-white rounded-xl border-b-4 border-r-4 border-b-pri-500 border-r-pri-500 shadow-md">
            <h2 className="text-pri-600 text-3xl font-medium mb-2">Event Details</h2>
            <div className="flex w-full" id="event-card">
              <div>
                <img
                  src={eventData.thumbnail}
                  alt={eventData.eventName}
                  className="rounded-lg max-w-[20rem]"
                />
              </div>
              <div className="flex-col content-start px-4 py-2">
                <div className="flex">
                  <h3 className="text-wrap text-xl lg:text-xl xl:text-2xl font-medium tracking-tight">{eventData.eventName}</h3>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <div className="col-span-1 flex">
                    <p className="font-bold">Venue:&nbsp;</p>
                    <p className="">{eventData.venue}</p>
                  </div>
                  <div className="col-span-1 flex">
                    <p className="font-bold">Time:&nbsp;</p>
                    <p className="">{formatDatetime(eventData.startTime)}</p>
                  </div>
                  <div className="col-span-1 flex">
                    <p className="font-bold">
                      Ticket Pricing:&nbsp;
                    </p>
                    <p className="">${eventData.price.toFixed(2)}</p>
                  </div>
                  <div className="col-span-1 flex">
                    <p className="font-bold">
                      Tickets Available:&nbsp;
                    </p>
                    <p className="">{eventData.numTicketsAvailable}</p>
                  </div>
                </div>
                <div className="">
                  <h6 className="text-md font-bold mt-4">Note:</h6>
                  <ul className="list-disc list-inside">
                      <li>You may purchase multiple tickets per booking, with the option to specify up to <span className="underline">4</span> accompanying guests per ticket</li>
                      <li>Booking cancellations may be subject to cancellation fee</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-col mt-4">
            <div className="flex justify-between items-center gap-1">
              <div className="h-[4rem] flex items-center gap-2 text-pri-500 text-xl font-medium tracking-tight px-12 py-3 bg-white rounded-xl border-b-4 border-r-4 border-b-pri-500 border-r-pri-500 shadow-md">
                Number of Tickets:
                <input
                  className="w-[3rem] text-xl text-pri-500 text-center font-light tracking-tighter py-1.5 pb-0.5 border border-pri-500 focus:outline-pri-500 rounded-lg"
                  name="name"
                  placeholder="1"
                  value={numTickets}
                  onChange={(e) => {
                    handleChangeTickets(Number(e.target.value));
                  }}
                  type="number"
                  autoComplete="off"
                  min={1}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
              <div className="px-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={loading} className="h-[4rem] px-12 py-7 text-white text-xl font-medium border-b-4 border-r-4 border-b-pri-300 border-r-pri-300 hover:border-b-pri-500 hover:border-r-pri-500 bg-pri-500 hover:text-pri-500 hover:bg-white hover:-translate-x-2 shadow-md rounded-xl transition-all duration-150 ease-in-out">
                      Buy Tickets
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Booking</DialogTitle>
                      <DialogDescription>
                        No refunds will be issued once tickets are sold
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Total Price
                        </Label>
                        <Input
                          disabled
                          id="price"
                          defaultValue={ totalPrice }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          defaultValue={password}
                          className="col-span-3"
                          onChange={handlePasswordChange}
                        />
                      </div>
                    </div>
                    <div></div>
                    <DialogFooter className="px-4">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="default"
                          onClick={handleBuyTickets}
                        >
                          Confirm
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex-col mt-4 gap-4">
              {Array.from({ length: numTickets }).map((_, index) => (
                <div className="" key={index}>
                  <CreateNewBookingCard
                    inputDate={eventData.startTime}
                    eventID={eventData.eventID}
                    eventName={eventData.eventName}
                    venue={eventData.venue}
                    thumbnail={eventData.thumbnail}
                    handleUpdateTicket={handleUpdateTicket}
                    index={index}
                  ></CreateNewBookingCard>
                </div>
              ))}
            </div>
          </div>
        <Toaster richColors position="bottom-right" />
      </main>
    );
  } else {
    const encodedCallbackUrl = encodeURIComponent(window.location.href);
    router.push(`/auth/signin?callbackUrl=${encodedCallbackUrl}`);
  }
}
