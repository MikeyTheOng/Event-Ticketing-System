import Link from "next/link";

import { redirect } from "next/navigation";
import { Toaster, toast } from "sonner";

// import { useSession } from "next-auth/react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import { CreateNewTO } from "@/components/CreateNewTO";
import { TOFunctions } from "@/components/TicketingOfficer/TOFunctions";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import { ApiClient } from "@/lib/api"
import { RiExternalLinkLine } from "react-icons/ri"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "Event Manager" && session?.user?.role !== "Ticketing Officer") {
    return redirect("/")
  }

  if (session?.user.role === "Ticketing Officer") {
    return (
      <main className="">
        <TOFunctions />
      </main>
    )
  }

  const [events, stats] = await Promise.all([
    ApiClient.getEvents({ cache: "no-store" }),
    ApiClient.getDashboardStats({ auth: session.user.token }, { cache: "no-store" }),
  ])

  return (
    <main className="">
      <div className="grid grid-cols-12 gap-4 px-4 py-2">
        <div className="col-span-4 grid grid-cols-3 gap-4">
          <div className="col-span-3 grid grid-cols-3 gap-4">
            <div className="col-span-1 sm:aspect-square bg-white p-2 border-b-4 border-r-4 border-b-pri-500 border-r-pri-500 shadow-md rounded-xl">
              <div className="grid grid-cols-1 h-full">
                <div className="col-span-1">
                  <h6 className="text-xl 2xl:text-2xl text-pri-500">Events</h6>
                  <p className="text-lg text-slate-500 tracking-tighter -mt-2">Total</p>
                </div>
                <div className="col-span-1 self-end">
                  <p className="w-full text-end text-pri-500 sm:text-6xl 2xl:text-9xl">{stats?.stats?.numEvents}</p>
                </div>
              </div>
            </div>
            <div className="col-span-1 sm:aspect-square bg-white p-2 border-b-4 border-r-4 border-b-[#8769B5] border-r-[#8769B5] shadow-md rounded-xl">
              <div className="grid grid-cols-1 h-full">
                <div className="col-span-1">
                  <h6 className="text-xl 2xl:text-2xl text-[#8769B5]">Bookings</h6>
                  <p className="text-lg text-slate-500 tracking-tighter -mt-2">Made</p>
                </div>
                <div className="col-span-1 self-end">
                  <p className="w-full text-end text-[#8769B5] sm:text-6xl 2xl:text-9xl">{stats?.stats?.numBookings}</p>
                </div>
              </div>
            </div>
            <div className="col-span-1 sm:aspect-square bg-white p-2 border-b-4 border-r-4 border-b-[#F34E7B] border-r-[#F34E7B] shadow-md rounded-xl">
              <div className="grid grid-cols-1 h-full">
                <div className="col-span-1">
                  <h6 className="text-xl 2xl:text-2xl text-[#F34E7B]">Tickets</h6>
                  <p className="text-lg text-slate-500 tracking-tighter -mt-2">Sold</p>
                </div>
                <div className="col-span-1 self-end">
                  <p className="w-full text-end text-[#F34E7B] sm:text-6xl 2xl:text-9xl">{stats?.stats?.numTickets}</p>
                </div>
              </div>
            </div>
            <div className="col-span-3 max-h-[3rem] grid grid-cols-2 gap-4 tracking-tight">
              <div className="col-span-1 py-3 text-slate-600 font-medium border-b-4 border-r-4 border-b-slate-400 border-r-slate-400 hover:border-b-pri-500 hover:border-r-pri-500 bg-white hover:text-pri-500 hover:-translate-x-2 shadow-md rounded-md transition-all duration-150 ease-in-out">
                <Link href="/event/create">
                  <span className="flex items-center w-full justify-center">
                    Create Event&nbsp;
                    <RiExternalLinkLine className="mb-0.5" size={20} />
                  </span>
                </Link>
              </div>

              <div className="col-span-1 py-3 text-slate-600 font-medium border-b-4 border-r-4 border-b-slate-400 border-r-slate-400 hover:border-b-pri-500 hover:border-r-pri-500 bg-white hover:text-pri-500 hover:-translate-x-2 shadow-md rounded-md transition-all duration-150 ease-in-out">
                <Link href="/dashboard/report">
                  <span className="flex items-center w-full justify-center">
                    Reports&nbsp;
                    <RiExternalLinkLine className="mb-0.5" size={20} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-3 sm:h-auto 2xl:h-[34rem] px-10 pt-6 pb-6 bg-white border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 shadow-md rounded-xl border">
            <CreateNewTO />
          </div>
        </div>
        <div className="col-span-8 flex-col inline-block bg-white border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 shadow-md rounded-xl">
          <DataTable columns={columns} data={events} />
        </div>
      </div>
    </main>
  )
}
