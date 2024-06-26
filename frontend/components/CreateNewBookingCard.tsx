"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";
import { Dialog, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { IoIosStar } from "react-icons/io";
import { MdInfoOutline } from "react-icons/md";

function formatDateDDMMYY(inputDate: string): string {
  const date = new Date(inputDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month starts from 0
  const year = date.getFullYear();

  // Pad day and month with leading zeros if needed
  const formattedDay = day.toString().padStart(2, "0");
  const formattedMonth = month.toString().padStart(2, "0"); // Corrected this line

  return `${formattedDay}/${formattedMonth}/${year % 100}`;
}

function formatDateTicketDisplayFormat(inputDate: string): string {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(inputDate);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = monthsOfYear[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  // Convert hours from 24-hour format to 12-hour format
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  return `${dayOfWeek} — ${month} ${day} ${year} ${hours}:${minutes
    .toString()
    .padStart(2, "0")}${ampm}`;
}

interface CreateNewBookingCardProps {
  inputDate: string;
  eventID: string;
  eventName: string;
  venue: string;
  thumbnail: string;
  index: number;
  handleUpdateTicket: Function;
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

export function CreateNewBookingCard({
  inputDate,
  eventID,
  eventName,
  venue,
  thumbnail,
  index,
  handleUpdateTicket,
}: CreateNewBookingCardProps) {
  const [ticketState, setTicketState] = useState<string>("1");
  function handleRadioChange(event: React.ChangeEvent<HTMLInputElement>) {
    handleUpdateTicket(index, Number(event.target.value));
    console.log(event.target.value);
    setTicketState(String(event.target.value));
  }

  return (
    <div className=" bg-white border-b-4 border-r-4 border-b-slate-400 border-r-slate-400 rounded-l-lg rounded-r-xl grid grid-cols-12 min-h-[16rem] mb-4 shadow-md relative">
      <div
        className="col-span-1 flex flex-col justify-between gap-4 bg-pri-500 text-white rounded-l-sm px-4 py-4 border-r-[6px] border-r-pri-300"
        id="booking-details"
      >
        <div>
          <p className="text-lg font-light tracking-tighter">Ticket</p>
          <p className="text-lg font-medium">{index + 1}</p>
        </div>
      </div>
      <div className="col-span-4 bg-contain bg-no-repeat"
      >
        <img className="h-full w-full object-fill" src={thumbnail} alt={eventName} />
      </div>
      <div className="col-span-6 py-6 pl-4 pr-10" id="event-details">
        <div className="flex gap-4 h-full">
          <div className="h-full flex flex-col justify-center gap-4">
            <IoIosStar size={17} />
            <IoIosStar size={17} />
            <IoIosStar size={17} />
            <IoIosStar size={17} />
            <IoIosStar size={17} />
            <IoIosStar size={17} />
          </div>
          <div>
            <h4 className="text-wrap text-slate-700 text-xl lg:text-xl xl:text-2xl font-medium tracking-tight">
              {eventName}
            </h4>
            <div className="mt-1">
              <p className="text-wrap text-slat-500 text-sm lg:text-lg">
                LIVE AT&nbsp;
                <span className="text-slate-700 font-medium text-lg">{venue}</span>
              </p>
              <p className="text-wrap text-slate-500 font-medium tracking-wide text-sm lg:text-md">
                {formatDateTicketDisplayFormat(inputDate)}
              </p>
            </div>

            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    className="bg-emerald-300 hover:bg-emerald-400 cursor-default tracking-wide text-sm lg:text-xs"
                    variant="outline"
                  >
                    Upcoming <MdInfoOutline className="font-light" size={14} />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="bg-emerald-400 max-w-[12rem] text-center">
                  Upcoming event!
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div id='radio-buttons'>
              <div className="flex-col mt-1 h-full content-start col-span-4 bg-contain bg-no-repeat">
                <h3 className="mb-1 font-semibold text-slate-700 dark:text-white">
                  No. of Guests:
                </h3>
                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div className="flex items-center ps-3">
                      <input
                        id="horizontal-list-radio-license"
                        type="radio"
                        value="1"
                        name={`${index}list-radio`}
                        checked={ticketState === "1"}
                        onChange={handleRadioChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="horizontal-list-radio-license"
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        1
                      </label>
                    </div>
                  </li>
                  <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div className="flex items-center ps-3">
                      <input
                        id="horizontal-list-radio-id"
                        type="radio"
                        value="2"
                        name={`${index}list-radio`}
                        checked={ticketState === "2"}
                        onChange={handleRadioChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="horizontal-list-radio-id"
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        2
                      </label>
                    </div>
                  </li>
                  <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div className="flex items-center ps-3">
                      <input
                        id="horizontal-list-radio-military"
                        type="radio"
                        value="3"
                        name={`${index}list-radio`}
                        checked={ticketState === "3"}
                        onChange={handleRadioChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="horizontal-list-radio-military"
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        3
                      </label>
                    </div>
                  </li>
                  <li className="w-full dark:border-gray-600">
                    <div className="flex items-center ps-3">
                      <input
                        id="horizontal-list-radio-passport"
                        type="radio"
                        value="4"
                        name={`${index}list-radio`}
                        checked={ticketState === "4"}
                        onChange={handleRadioChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="horizontal-list-radio-passport"
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        4
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <div className="col-span-1" id="status-details">
        <div className="flex justify-center h-full w-full bg-pri-500 rounded-r-lg">
          <p className="[writing-mode:vertical-lr] rotate-180 text-center text-white tracking-tight"></p>
        </div>
      </div>
    </div>
  );
}
