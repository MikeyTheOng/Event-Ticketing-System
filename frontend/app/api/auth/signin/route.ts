// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// https://nextjs.org/docs/app/api-reference/functions/next-response#json

import { ApiClient } from "@/lib/api"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic" // defaults to auto

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // console.log("Request body: ", body)

    const res = await ApiClient.login(body)

    if (!res.success) {
      return NextResponse.json(
        { msg: res.message, error: res.message },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      { msg: res.message, user: res.data },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.log("Error: ", error)
    return NextResponse.json(
      { msg: "Error validating user", error: error },
      {
        status: 500,
      }
    )
  }
}

export async function GET(request: Request) {
  redirect("/auth/signin")
}
