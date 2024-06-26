// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// https://nextjs.org/docs/app/api-reference/functions/next-response#json

import { NextResponse } from "next/server"
import { API_URL } from "@/lib/api"

export const dynamic = "force-dynamic" // defaults to auto
export async function POST(request) {
  try {
    const body = await request.json()
    // console.log("Request body: ", body)

    // POST reqeust to Spring Boot
    const response = await fetch(`${API_URL}/user/create/ticketingOfficer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    // console.log("After api call: ");
    const data = await response.json()
    return NextResponse.json(
      { msg: "User created sucessfully", data: data },
      {
        status: 200,
      }
    )
  } catch (error) {
    return NextResponse.json(
      { msg: "Error creating user", error: error },
      {
        status: 500,
      }
    )
  }
}
