"use client"

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { API_URL, ApiClient } from "@/lib/api"
import React, { useEffect } from "react"

interface Event {
  eventID: number
  eventName: string
  startTime: string
  venue: string
  numTotalTickets: number
  numTicketsAvailable: number
  price: number
  cancellationFee: number
  thumbnail: string
  className: string
}

export default async function EventsHub() {
  // const session = await getServerSession(authOptions);

  // console.log("Index Server Session:", session);
  // if(!session){
  //   redirect("/auth/signin");
  // }
  function formatDateString(dateString: string) {
    // Create a Date object from the string
    const date = new Date(dateString)

    // Define options for formatting the date
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric", // 4-digit year
      month: "short", // Short month name (e.g., "Jan", "Feb")
      day: "2-digit", // Day of the month (2-digit)
      weekday: "short", // Short day name (e.g., "Mon", "Tue")
    }

    // Format the date using toLocaleDateString
    const formattedDate = date.toLocaleDateString("en-GB", options)

    return formattedDate
  }

  const [_eventsArr, _newListingArr] = await Promise.all([
    ApiClient.getEvents({ cache: "no-store" }),
    ApiClient.getNewEvents({ cache: "no-store" }),
  ])
  
  let counter=0;
  const eventsArr = _eventsArr.map((event, index) => {
    let className = '';
    if (counter === 0) {
        className = "col-span-2 md:col-span-2";
        counter++;
    } else if (counter === 1) {
        className = "col-span-1 md:col-span-1";
        counter++;
    } else if (counter === 2) {
        className = "col-span-1 md:col-span-1";
        counter++;
    } else {
        className = "col-span-2 md:col-span-2";
        counter = 0;
    }
    // Update the className property of the event object
    return { ...event, className };
  });
  counter=0;
  const newListingArr = _newListingArr.map((event, index) => {
    let className = '';
    if (counter === 0) {
        className = "col-span-2 md:col-span-2";
        counter++;
    } else if (counter === 1) {
        className = "col-span-1 md:col-span-1";
        counter++;
    } else if (counter === 2) {
        className = "col-span-1 md:col-span-1";
        counter++;
    } else {
        className = "col-span-2 md:col-span-2";
        counter = 0;
    }
    // Update the className property of the event object
    return { ...event, className };
  });

  const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
  )

  return (
    <main className="mt-4 mb-2.5 mx-12 lg:mx-[12rem] 2xl:mx-[28rem]">
      <div className="py-6 text-nowrap">
        <div className="rounded-t-lg">
          <h2 className="text-3xl text-pri-500 font-bold mb-1">Newly Listed</h2>
          <div className="w-[50px] border-2 border-pri-500"></div>
        </div>
        {newListingArr.length == 0 && <p className="text-slate-500">No new events listed</p>}
        <BentoGrid className="mt-4">
          {newListingArr.map((event: Event, i: number) => (
            <BentoGridItem
              key={i}
              header={Skeleton()}
              title={event.eventName}
              startTime={formatDateString(event.startTime)}
              thumbnail={event.thumbnail}
              className={event.className}
              href={`/event/view/${event.eventID}`}
            />
          ))}
        </BentoGrid>
      </div>
      <div className="py-6 text-nowrap">
        <div className="rounded-t-lg">
          <h2 className="text-3xl text-pri-500 font-bold mb-1">Up and Coming!</h2>
          <div className="w-[50px] border-2 border-pri-500"></div>
        </div>
        <BentoGrid className="py-6">
          {eventsArr.map((event: Event, i: number) => (
            <BentoGridItem
              key={i}
              header={Skeleton()}
              title={event.eventName}
              startTime={formatDateString(event.startTime)}
              thumbnail={event.thumbnail}
              className={event.className}
              href={`/event/view/${event.eventID}`}
            />
          ))}
        </BentoGrid>
      </div>
    </main>
  )
}
