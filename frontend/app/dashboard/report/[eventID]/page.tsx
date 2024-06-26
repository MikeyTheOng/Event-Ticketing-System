import { ApiClient } from "@/lib/api"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { toast } from "sonner"
import { ExportButton } from "./_components/ExportButton"

export default async function EventReportPage({ params }: { params: { eventID: string } }) {
  if (!params.eventID || typeof params.eventID !== "string") {
    toast.error("Invalid event ID")
    return redirect("/dashboard")
  }
  const session = await getServerSession(authOptions)
  if (session?.user.role !== "Event Manager") {
    return redirect("/")
  }

  console.log("session", session)
  console.log("params", params)
  const report = await ApiClient.getEventReport({ eventId: params.eventID, auth: session.user.token })

  return (
    <main className="mx-28 lg:mx-28 2xl:mx-96 py-6">
      <div className="flex flex-col gap-4 px-4 py-2">
        <h1 className="text-pri-600 text-3xl font-medium mb-2.5">{report.event.eventName}</h1>
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="">
            <div>{new Date(report.event.startTime).toLocaleString()}</div>
            <div className="flex">
              {report.event.cancelled ? (
                <div className="bg-red-500 text-white px-2 py-1 rounded">Cancelled</div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <Suspense>
              <ExportButton eventID={params.eventID} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-1 mt-2">
        <div className="flex justify-between">
          <span className="font-semibold">Total Bookings:</span>
          <span>{report.numBookings.toLocaleString()}</span>
        </div>
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
    </main>
  )
}
