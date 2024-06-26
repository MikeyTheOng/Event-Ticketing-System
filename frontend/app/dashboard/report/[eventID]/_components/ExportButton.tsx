"use client"

import { ApiClient } from "@/lib/api"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function ExportButton({ eventID }: { eventID: string }) {
  const { data: session } = useSession()
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUrl() {
      if (session?.user.role !== "Event Manager") {
        return
      }
      console.log("data", {
        eventId: eventID,
        auth: session.user.token,
      })

      const blob = await ApiClient.getEventReportExport({ eventId: eventID, auth: session.user.token })
      console.log("blob", blob)
      const url = URL.createObjectURL(blob)
      setUrl(url)
    }
    fetchUrl()
  }, [eventID, session?.user.token])

  if (session?.user.role !== "Event Manager") {
    return null
  }

  if (!url) {
    return null
  }

  return (
    <div className="col-span-1 py-3 text-slate-600 font-medium border-b-4 border-r-4 border-b-slate-400 border-r-slate-400 hover:border-b-pri-500 hover:border-r-pri-500 bg-white hover:text-pri-500 hover:-translate-x-2 px-2 shadow-md rounded-md transition-all duration-150 ease-in-out">
      <a href={url} download={`report_${eventID}.csv`}>
        <span className="flex items-center w-full justify-center">
          Export&nbsp;
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            className="mb-0.5"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path>
          </svg>
        </span>
      </a>
    </div>
  )
}
