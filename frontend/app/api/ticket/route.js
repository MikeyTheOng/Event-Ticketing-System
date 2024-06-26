// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// https://nextjs.org/docs/app/api-reference/functions/next-response#json

import { NextResponse } from "next/server"
import { API_URL } from "@/lib/api"

export const dynamic = "force-dynamic" // defaults to auto
export async function GET(request) {
  try {
    //const body = await request.json();
    // console.log("Request body: ", body)
    const { searchParams } = new URL(request.url)
    const ticketId = searchParams.get("ticketId")

    // GET reqeust to Spring Boot
    const response = await fetch(`${API_URL}/ticket/${ticketId}`)
    // console.log("After api call: ");
    const data = await response.json()
    return NextResponse.json(
      { msg: "Ticket verified sucessfully", data: data },
      {
        status: 200,
      }
    )
  } catch (error) {
    return NextResponse.json(
      { msg: "Ticket verification failed", error: error },
      {
        status: 500,
      }
    )
  }
}
