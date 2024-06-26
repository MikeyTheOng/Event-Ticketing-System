import Link from "next/link"
import React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

import { TfiAnnouncement } from "react-icons/tfi"
import { API_URL } from "@/lib/api"

export default async function Event({ params }: { params: { eid: string } }) {
    const currentDate = new Date();
    const session = await getServerSession(authOptions)
    console.log("Event Server Session:", session)
    function formatDateString(dateString: string) {
    // Create a Date object from the string
    const date = new Date(dateString)

    // Define options for formatting the date
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric", // 4-digit year
      month: "short", // Short month name (e.g., "Jan", "Feb")
      day: "2-digit", // Day of the month (2-digit)
      weekday: "short", // Short day name (e.g., "Mon", "Tue")
      hour: "numeric", // Hour (e.g., 12-hour clock)
      minute: "2-digit", // Minutes
    }

        // Format the date using toLocaleDateString
        const formattedDate = date.toLocaleDateString('en-GB', options);

        return formattedDate;
    }
    function calculateDateSixMonthsEarlier(dateTimeString : string) {
        const dateTime = new Date(dateTimeString);
        const futureDateSixMonths = new Date(dateTime);
        futureDateSixMonths.setMonth(futureDateSixMonths.getMonth() - 6);
        futureDateSixMonths.setDate(1);
        return futureDateSixMonths.toISOString();
    }
    function calculateDateTwentyFourHoursEarlier(dateTimeString : string) {
        const dateTime = new Date(dateTimeString);
        const futureDateTwentyFourHours = new Date(dateTime);
        futureDateTwentyFourHours.setHours(futureDateTwentyFourHours.getHours() - 24);
        return futureDateTwentyFourHours.toISOString();
    }
    const fetchData = async () => { // retrieve events from spring
        try {
            const response = await fetch(`http://127.0.0.1:8080/event/${params.eid}`, { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                // console.log("Fetched Data:", data);
                return data;
            } else {
                console.error("fetchData error: response")
                throw new Error("Failed to perform server action");
            }
        } catch (error) {
            console.error(error);
        }
    }
    const eventData = await fetchData();
    console.log("Event Data:", eventData);
    // Convert Event Data to JSON String; Allows us to pass the data through the URL
    const eventDataString = JSON.stringify(eventData);
    if(eventData == null){
        return(<>Event does not exist</>)
    }
    return (
        <main className='-mt-[4.5rem]'>
            <div>
                {/* <h1>Event Page {params.eid}</h1> */}
                <div>
                    {/* Lorem ipsum dolor sit amet consectetur adipisicing elit.  */}
                </div>
                <div id='hero-section'>
                    <div 
                        className="bg-center flex justify-center relative"
                        style={{ backgroundImage: `url(${eventData.thumbnail})`,  
                            filter: 'blur(0.5px)',
                            height: '100vh',
                        }}
                    >
                        <div className="bg-black opacity-65 w-full h-full"></div>
                    </div>             
                    <div 
                        className="max-h-[70vh] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%] rounded-lg shadow-lg text-white flex flex-col items-start"
                        id="hero-section-card"
                        // style={{ backgroundImage: `url(${eventData.thumbnail})`}}
                    >
                        {/* TODO: Adjust styling of content card*/}
                        <div>
                            <img src={eventData.thumbnail} alt={eventData.eventName} className="rounded-sm" width="500px" height="300px"/>
                        </div>
                        <div className="w-full">
                            <p className="text-left text-lg font-normal tracking-wide mt-1 whitespace-nowrap">{formatDateString(eventData.startTime)} / {eventData.venue}</p>
                        </div>
                        <div className="w-full">
                            <h2 className="text-left text-xl font-bold mt-0.5 tracking-wider whitespace-nowrap">{eventData.eventName} </h2>
                        </div>
                    </div>
                </div>
                <div id='sub-navbar' className="w-full 2xl:px-96 bg-white shadow-2xl sticky top-0">
                    <nav className="py-6 px-12 text-lg font-medium text-slate-500 flex justify-between items-center">
                        <div>
                            <a href='#event-details' className="hover:text-slate-400">Event Details</a>
                            <a href='#ticket-pricing' className="ml-8 hover:text-slate-400">Ticket Pricing</a>
                            <a href='#FAQ' className="ml-8 hover:text-slate-400">FAQ</a>
                            <a href='#Admission Policy' className="ml-8 hover:text-slate-400">Admission Policy</a>
                        </div>
                        <div className="">
                        {
                            session?.user.role === "Event Manager"
                            ? (
                                currentDate.toISOString() < eventData.startTime
                                ? (
                                <Link href={`/event/update/${params.eid}`}>
                                    <button className="px-12 py-2 text-pri-500 font-medium border border-pri-500 border-b-4 border-r-4 border-b-pri-500 border-r-pri-500  hover:border-pri-500 bg-white hover:text-white hover:bg-pri-500 hover:-translate-y-1 hover:-translate-x-1 shadow-md rounded-md transition-all duration-150 ease-in-out">
                                        EDIT EVENT
                                    </button>
                                </Link>
                            ) : (
                                <button className="px-12 py-2 text-slate-400/70 font-medium border border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 bg-slate-100/50 shadow-md rounded-md cursor-not-allowed" disabled>
                                        Edit Unavailable
                                    </button>
                                )
                            ) : (
                                currentDate.toISOString() > calculateDateSixMonthsEarlier(eventData.startTime) &&
                                currentDate.toISOString() < calculateDateTwentyFourHoursEarlier(eventData.startTime)
                                ? (
                                    <Link href={`/event/bookings/create/${encodeURIComponent(eventDataString)}`}>
                                        <button className="px-12 py-2 text-pri-500 font-medium border border-pri-500 border-b-4 border-r-4 border-b-pri-500 border-r-pri-500  hover:border-pri-500 bg-white hover:text-white hover:bg-pri-500 hover:-translate-y-1 hover:-translate-x-1 shadow-md rounded-md transition-all duration-150 ease-in-out">
                                            BUY TICKETS
                                        </button>
                                    </Link>
                            ) : (
                                <button className="px-12 py-2 text-slate-400/70 font-medium border border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 bg-slate-100/50 shadow-md rounded-md cursor-not-allowed" disabled>
                                    Tickets Unavailable
                                </button>
                                )
                            )
                        }
                        </div>
                    </nav>
                </div>
                <div id="event-details" className="px-12 2xl:px-96 pb-12 pt-10 min-h-[50vh]">
                    <div className="text-purple-700 h-[15vh] bg-purple-200 border border-purple-700 text-center flex justify-center items-center mb-10 rounded-md px-5">
                        <TfiAnnouncement />&nbsp;
                        We are the official ticketing partner for the Singapore shows and we cannot guarantee that tickets purchased elsewhere will be legitimate.
                    </div>
                    <h2 className="text-3xl font-bold">Event Details</h2>
                    <div className="w-[50px] border-2 border-black"></div>
                    <div className="flex-col w-full px-12">
                        <h4 className="text-lg font-bold text-center mt-4">{eventData.eventName}</h4>
                        <div className="mt-8">
                            <p className="text-black whitespace-pre-wrap mb-4">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                                Rerum quasi architecto laborum veniam ipsam consequatur alias voluptates autem debitis, 
                                pariatur voluptatem inventore, distinctio voluptas, vero quisquam adipisci enim fugit. 
                                Fuga.
                                <br/>
                            </p>
                            <p className="text-black whitespace-pre-wrap mb-4">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                Corporis, accusamus alias sint impedit, eligendi quia veniam cupiditate ea ducimus 
                                tempora natus consectetur officiis obcaecati voluptatum sed, perspiciatis culpa cumque soluta. Lorem ipsum dolor sit amet consectetur adipisicing elit. In eum fuga qui inventore assumenda maiores, sed culpa voluptatum neque, dicta recusandae accusantium veritatis eius fugit hic quaerat placeat odio saepe.
                            </p>
                        </div>
                    </div>
                </div>
                <div id="ticket-pricing" className="px-12 2xl:px-96 pb-12 pt-10 min-h-[50vh] bg-white">
                    <h2 className="text-3xl font-bold">Ticket Pricing</h2>
                    <div className="w-[50px] border-2 border-black"></div>
                    <div className="mt-4">
                        <h4 className="text-pri-600 text-lg font-medium mt-4">General Sale</h4>
                        <div className="text-md">
                            <p className="whitespace-pre-wrap">
                                Sales start from: <span className="underline">{formatDateString(calculateDateSixMonthsEarlier(eventData.startTime))}</span>
                                <br/>
                                Deadline for purchase: <span className="underline">{formatDateString(calculateDateTwentyFourHoursEarlier(eventData.startTime))}</span> 
                                <br/>
                                <p>Ticket Pice: ${eventData.price.toFixed(2)} Cancellation Fee: ${eventData.cancellationFee.toFixed(2)}</p>
                                Via <Link href="/" className="hover:text-pri-500 hover:underline">www.localhost.com</Link> and in-person at {eventData.venue}
                            </p>
                        </div>
                        <h6 className="text-md font-bold mt-4">Note:</h6>
                        <ul className="list-disc list-inside">
                            <li>You may purchase multiple tickets per booking, with the option to specify up to <span className="underline">4</span> accompanying guests per ticket</li>
                            <li>Booking cancellations may be subject to cancellation fee</li>
                        </ul>
                    </div>
                </div>
                <div id="FAQ" className="px-12 2xl:px-96 pb-12 pt-10 min-h-[50vh]">
                    <h2 className="text-3xl font-bold">FAQ</h2>
                    <div className="w-[50px] border-2 border-black"></div>
                    <div className="mt-4">
                        <ol className="list-decimal ml-6">
                            <li className="mt-1.5">
                                The Organiser/Venue Owner reserves the right without refund or compensation to refuse admission/evict any person(s) whose conduct is disorderly or inappropriate or who poses a threat to security, or to the enjoyment of the Event by others.
                            </li>
                            <li className="mt-1.5">
                                Ticket holders assume all risk of injury and all responsibility for property loss, destruction or theft and release the promoters, performers, sponsors, ticket outlets, venues, and their employees from any liability thereafter.
                            </li>
                            <li className="mt-1.5">
                                The resale of ticket(s) at the same or any price in excess of the initial purchase price is prohibited.
                            </li>
                            <li className="mt-1.5">
                                We would like to caution members of the public against purchasing tickets from unauthorized sellers or 3rd party websites. By purchasing tickets through these non-authorized points of sale, buyers take on the risk that the validity of the tickets cannot be guaranteed, with no refunds possible.
                            </li>
                        </ol>
                    </div>
                </div>
                <div id="Admission Policy" className="px-12 2xl:px-96 pb-12 pt-10 min-h-[50vh] bg-white">
                    <h2 className="text-3xl font-bold">Admission Policy</h2>
                    <div className="w-[50px] border-2 border-black"></div>
                    <div className="mt-4">
                    <h6 className="text-md font-bold mt-4">Admission Rules:</h6>
                        <ol className="list-decimal ml-6">
                            <li className="mt-1.5">
                                No professional photography, videography of any kind is allowed.
                            </li>
                            <li className="mt-1.5">
                                No iPads, tablets and laptops are allowed.
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </main>
    )
}
