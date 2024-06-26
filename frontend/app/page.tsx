import Link from "next/link"
import { redirect } from "next/navigation"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { API_URL, ApiClient } from "@/lib/api"

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

export default async function Home() {
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

  const eventsArr = await ApiClient.getEvents({ cache: 'no-store' })

  let counter = 0;
  const styledEvents = eventsArr.map((event, index) => {
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
    <main>
      <div className="mt-4 mb-2.5 mx-12 lg:mx-[12rem] 2xl:mx-[28rem]" id="events">
        <BentoGrid className="">
          {styledEvents.map((event: Event, i: number) => (
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
