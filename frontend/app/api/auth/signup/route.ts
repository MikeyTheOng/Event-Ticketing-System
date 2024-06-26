import { ApiClient } from "@/lib/api"
import { NextResponse } from "next/server"

// export const dynamic = "force-dynamic" // defaults to auto

export async function POST(request: Request) {
  console.log("Sign Up...")
  try {
    const body = await request.json()
    // console.log("Request body: ", body)

    const res = await ApiClient.signup(body)
    console.log("Response:", res)
    if (!res.success) {
      return NextResponse.json(
        { msg: res.message, error: res.message },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      { msg: res.message, data: res.data },
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
