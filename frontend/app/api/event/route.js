// pages/api/booking/[email].js

import { NextResponse } from "next/server"
import { API_URL } from "@/lib/api"

export const dynamic = "force-dynamic" // defaults to auto

export async function PUT(request) {
  try {
    console.log("Cancelling Event...")
    const searchParams = request.nextUrl.searchParams
    const eventID = searchParams.get("eventID")

    const url = `${API_URL}/event/${eventID}/cancel`
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(true),
    })
    // console.log("Response:", response);
    // const data = await response.json();
    // console.log("Data:", data);
    console.log("Event successfully cancelled")
    return NextResponse.json(
      { msg: `Cancel event`, eventID: eventID },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(`Error cancelling event`, error)
    return NextResponse.json(
      { msg: `Error cancelling event`, error: error },
      {
        status: 500,
      }
    )
  }
}
