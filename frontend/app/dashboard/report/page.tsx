import { authOptions } from "@/lib/auth"
import { ApiClient } from "@/lib/api"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default async function ReportPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== "Event Manager") {
    return redirect("/")
  }
  const events = await ApiClient.getEvents()
  return (
    <main className="mx-28 lg:mx-28 2xl:mx-96 py-6">
      <div className="grid grid-cols-12 gap-4 px-4 py-2">
        <h1 className="text-pri-600 text-3xl font-medium mb-2.5">Reports</h1>
      </div>

      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <Suspense
            key={event.eventID}
            fallback={
              <div className="rounded-xl border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 max-h-full group/bento shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white flex-col col-span-2 md:col-span-2 h-32 animate-pulse"></div>
            }
          >
            <Link key={event.eventID} href={`/dashboard/report/${event.eventID}`}>
              <Eventlist eventID={event.eventID.toString()} />
            </Link>
          </Suspense>
        ))}
      </div>
    </main>
  )
}

async function Eventlist({ eventID }: { eventID: string }) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== "Event Manager") {
    return redirect("/")
  }
  const report = await ApiClient.getEventReport({ eventId: eventID, auth: session.user.token })
  return (
    <div className="rounded-xl border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 cursor-pointer max-h-full group/bento hover:-translate-x-2 hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white flex-col col-span-2 md:col-span-2">
      <h2 className="text-pri-600 text-2xl font-medium mb-2.5">{report.event.eventName}</h2>
      <div className="">{new Date(report.event.startTime).toLocaleString()}</div>

      <div className="flex flex-col space-y-1 mt-2">
        <div className="flex justify-between">
          <span className="font-semibold">Attended:</span>
          <span>{report.numAttended.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Tickets Sold:</span>
          <span>{report.numTicketsSold.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Revenue:</span>
          <span>
            {report.revenue.toLocaleString(undefined, {
              style: "currency",
              currency: "SGD",
            })}
          </span>
        </div>
      </div>
    </div>
  )
}
