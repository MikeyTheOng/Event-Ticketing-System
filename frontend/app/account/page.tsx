import type { Booking } from "@/lib/api/types"

import { redirect } from "next/navigation"

// import { useSession } from "next-auth/react";
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

import { BookingCard } from "@/components/BookingCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiClient } from "@/lib/api"
import { TfiAnnouncement } from "react-icons/tfi"

// const session = await getServerSession(authOptions);

export default async function MyAccount() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "Customer") {
    return redirect("/")
  }

  let bookingHistoryList: Booking[] = []
  let upcomingBookingsList: Booking[] = []
  let walletBalance = 0

  const [bookings, user] = await Promise.all([
    ApiClient.getMyBookings(
      { auth: session.user.token },
      {
        cache: "no-cache",
      }
    ),
    ApiClient.getSelf(
      { auth: session.user.token },
      {
        cache: "no-cache",
      }
    ),
  ])
  if (bookings.success) {
    bookingHistoryList = bookings.data["bookingHistory"]
    upcomingBookingsList = bookings.data["upcomingBookings"]
  }

  if (user.success) {
    walletBalance = user.data.bal
  }

  return (
    <main className="mt-4 mx-28 xl:mx-10 2xl:mx-90">
      <div className="text-nowrap">
        <div className="text-purple-700 h-[15vh] bg-purple-200 border border-purple-700 mx-auto flex justify-center items-center rounded-md px-5">
          <TfiAnnouncement />
          &nbsp;View information about your account, bookings and wallet balance here!
        </div>
        <div id="account-info-div" className="mt-3 mb-8">
          <div className="flex-col w-full text-white border border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 rounded-r-xl shadow-md">
            <div className="bg-pri-500 px-12 pt-6 pb-3 rounded-t-lg">
              <h2 className="text-3xl font-bold mb-1">Account Information</h2>
              <div className="w-[50px] border-2 border-white"></div>
            </div>
            <div className="text-black bg-white px-12 pt-2 pb-6 rounded-b-lg">
              <div className="flex gap-1 mt-2">
                <h4 className="text-lg font-medium tracking-tighter">Name:</h4>
                <p className="text-lg tracking-normal">{session.user.name}</p>
              </div>
              <div className="flex gap-1">
                <h4 className="text-lg font-medium tracking-tighter">Email:</h4>
                <p className="text-lg tracking-normal">{session.user.email}</p>
              </div>
              <div className="flex gap-1">
                <h4 className="text-lg font-medium tracking-tighter">Wallet Balance:</h4>
                <p className="text-lg tracking-normal">${walletBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div id="bookings-div" className="pb-12">
          <div className="flex-col w-full">
            <Tabs defaultValue="upcoming">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Bookings</h2>
                  <div className="w-[50px] border-2 border-black"></div>
                </div>
                <TabsList className="w-[400px] shadow-md">
                  <TabsTrigger value="upcoming">
                    Upcoming <span className="tracking-tighter font-light"> &nbsp;({upcomingBookingsList.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="past">
                    Past <span className="tracking-tighter font-light"> &nbsp;({bookingHistoryList.length})</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="w-full text-wrap mt-4">
                <TabsContent value="upcoming">
                  {upcomingBookingsList.map((booking: Booking) => {
                    return <BookingCard key={booking.bookingID} booking={booking} />
                  })}
                </TabsContent>
                <TabsContent value="past">
                  {bookingHistoryList.map((booking: Booking) => {
                    return <BookingCard key={booking.bookingID} booking={booking} />
                  })}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
