// pages/api/booking/[email].js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { NextResponse } from "next/server"
import { API_URL } from "@/lib/api"

export const dynamic = "force-dynamic" // defaults to auto

function isValidEmail(email) {
  // Regular expression for validating email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
export async function GET(request) {
  try {
    console.log("Retrieve Bookings...")
    const searchParams = request.nextUrl.searchParams
    const encodedEmail = searchParams.get("bookerEmail")
    const email = decodeURIComponent(encodedEmail)

    if (!encodedEmail || !isValidEmail(email)) {
      console.log("Missing/Invalid bookerEmail parameter")
      return NextResponse.json(
        { msg: `Missing/Invalid bookerEmail parameter` },
        {
          status: 400,
        }
      )
    }

    // GET request to Spring Boot
    const response = await fetch(`${API_URL}/booking/${email}`)
    const data = await response.json()
    // console.log("Data:", data);
    return NextResponse.json(
      { msg: `Bookings successfully retrieved for ${email}`, bookings: data },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(`Error fetching bookings for ${email}:`, error)
    return NextResponse.json(
      { msg: `Error retrieving bookings for ${email}`, error: error },
      {
        status: 500,
      }
    )
  }
}

export async function PUT(request) {
  
  try {
    console.log("Retrieve Bookings...")
    const searchParams = request.nextUrl.searchParams
    const bookingID = searchParams.get("bookingID")

    const url = `${API_URL}/booking/${bookingID}/cancel`
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
    console.log("Booking successfully cancelled")
    return NextResponse.json(
      { msg: `Cancel booking`, bookingID: bookingID },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(`Error cancelling booking`, error)
    return NextResponse.json(
      { msg: `Error cancelling booking`, error: error },
      {
        status: 500,
      }
    )
  }
}

export async function POST(request) {
  // console.log("Creating Booking...");
  try {
    const session = await getServerSession(authOptions);
    const authToken = session?.user.token;
    console.log("Auth Token:", authToken);
    const body = await request.json();
    if(!isValidEmail(body.bookerEmail)) {
        return NextResponse.json(
            { msg: `Error creating booking`, "error" : "Invalid bookerEmail parameter"},
            {
                status: 500
            }
        );
    }
    const url = `http://127.0.0.1:8080/booking`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(body)
    });
    console.log("Response:", response);
    
    // const data = await response.json();
    if(response.status==201) {
      console.log("Data:", response.data);
      console.log("Booking created successfully");
      return NextResponse.json(
        { data : response.data},
        {
            status: 201
        }
      );
    } else {
        return NextResponse.json(
            { data : response.data},
            {
                status: response.status
            }
        );
    }
  } catch (error) {
    console.error(`Error creating booking`, error);
    return NextResponse.json(
        { msg: `Error creating booking`, "error" : error},
        {
            status: 500
        }
    );
  }
}