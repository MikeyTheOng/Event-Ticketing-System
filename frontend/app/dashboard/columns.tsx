"use client"
import { Event } from "@/lib/api/types"
import { useSession } from "next-auth/react"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast, Toaster } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { API_URL } from "@/lib/api"
import { useRouter } from "next/navigation"

function isBeforeStartTime(inputTimeString : string) {
    // Convert the input time string to a Date object
    const inputTime = new Date(inputTimeString);
    
    // Get the current time
    const currentTime = new Date();

    // Compare the current time with the input time
    return currentTime.getTime() < inputTime.getTime();
}

function formatDate(inputDate : string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Split the input date into date and time components
    const [datePart, timePart] = inputDate.split('T');

    // Extract year, month, and day from the date part
    const [year, month, day] = datePart.split('-').map(Number);

    // Extract hour and minute from the time part
    const [hour, minute] = timePart.split(':').map(Number);

    // Format the date and time
    const formattedDate = `${day} ${months[month - 1]} ${year.toString().slice(2)}`;
    const formattedTime = `${hour % 12 || 12}:${minute.toString().padStart(2, '0')}${hour < 12 ? 'am' : 'pm'}`;
    const formattedDate2 = `${day} ${months[month - 1]} ${year.toString().slice(2)}`;

    return { format1: `${formattedDate}, ${formattedTime}`, format2: formattedDate2 };
}



export const columns: ColumnDef<Event>[] = [
    {
        accessorKey: "eventID",
        header: "ID",
        cell: ({ row }) => {
            const eventID: string = row.getValue("eventID");
            return (
                <p className="hidden">{eventID}</p>
            )
        },
    },
    {
        accessorKey: "eventName",
        header: "Event",
        cell: ({ row }) => {
            const eventName: string = row.getValue("eventName");
            return (
                <TooltipProvider delayDuration={50}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[7.5rem] font-medium text-nowrap text-ellipsis overflow-hidden cursor-pointer">{eventName}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{eventName}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: "venue",
        header: "Venue",
        cell: ({ row }) => {
            const venue: string = row.getValue("venue");
            return (
                <TooltipProvider delayDuration={50}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[3rem] text-nowrap text-ellipsis overflow-hidden cursor-pointer">{venue}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{venue}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: "startTime",
        header: "Date", 
        // formatDate
        cell: ({ row }) => {
            const formattedDateTime = formatDate(row.getValue("startTime"));
            return (
                <TooltipProvider delayDuration={50}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[5rem] text-nowrap text-ellipsis overflow-hidden cursor-pointer">{formattedDateTime.format2}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{formattedDateTime.format1}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },
    {
        accessorKey: "numTotalTickets",
        header: "Tickets",
        cell: ({ row }) => {
            const numTotalTickets: number = row.getValue("numTotalTickets");
            return (
                <p className="maw-w-[2rem] text-nowrap text-ellipsis overflow-hidden ">{numTotalTickets}</p>
            )
        }
    },
    {
        accessorKey: "numTicketsAvailable",
        header: "Available",
        cell: ({ row }) => {
            const numTicketsAvailable: number = row.getValue("numTicketsAvailable");
            return (
                <p className="maw-w-[2rem] text-nowrap text-ellipsis overflow-hidden ">{numTicketsAvailable}</p>
            )
        }
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "cancellationFee",
        header: "Fee",
    },
    {
        accessorKey: "cancelled",
        header: "Cancelled",
        cell: ({ row }) => {
            const cancelled: boolean = row.getValue("cancelled");
            return cancelled ? <p className="text-red-500">Yes</p> : <p>No</p>;
        },
    },
    {
        id: "actions",
        cell: ActionsColumn,
    },
]


function ActionsColumn({ row }: { row: any}) {
    const { data: session } = useSession();
    const router = useRouter();
    const eventID = row.getValue("eventID");
    const handleCancelEvent = async () => {
        const url = `${API_URL}/event/${eventID}/cancel`;
        try {
            const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${session?.user?.token}`,
            }
            });
            const data = await response.text();
            console.log("Data:", data);
            if (!response.ok) {
                alert("Failed to cancel Event");
                throw new Error('Failed to cancel Event');
            }
        
            toast.success("Event has been Updated", {
                description:  "Event cancelled successfully",
                // action: {
                //   label: "View",
                //   onClick: () => {router.push(`/event/view/${data.eventID}`)},
                // },
            });
            console.log('Event cancelled successfully');
            window.scrollTo({ top: 0 });
            router.refresh();
        } catch (error : any) {
            console.error('Error cancelling event:', error.message);
        }
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-4 w-12 p-0">
                        <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Actions {row.getValue("cancelled")}</DropdownMenuLabel>
                    {
                        isBeforeStartTime(row.getValue("startTime")) && !row.getValue("cancelled")? (
                            <>
                                <DropdownMenuItem><a href={`/event/update/${row.original.eventID}`} className="text-slate-600 hover:text-pri-500">Edit event details</a></DropdownMenuItem>
                                <DropdownMenuItem><a href={`#`} className="text-slate-600 hover:text-pri-500" onClick={handleCancelEvent}>Cancel Event</a></DropdownMenuItem>
                            </>
                        ) : <DropdownMenuItem className="disabled:text-slate-400" disabled>No actions available</DropdownMenuItem>
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            <Toaster position="bottom-right" />
        </>
    )
}