import type { Booking } from "@/lib/api/types"

import { redirect } from 'next/navigation'

// import { useSession } from "next-auth/react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import { BookingCard } from "@/components/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// const session = await getServerSession(authOptions);

export default async function ViewBooking() {
  const session = await getServerSession(authOptions);
  let bookingHistoryList; let upcomingBookingsList;
  const fetchData = async (bookerEmail: string) => { // retrieve events from spring
      try {
        // console.log("Email:", bookerEmail);
        const encodedEmail = encodeURIComponent('mike@gmail.com'); // need to encode as there's a special character
        // console.log("Encoded Email:", encodedEmail);
        const response = await fetch(`http://localhost:3000/api/booking/?bookerEmail=${encodedEmail}`, { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            console.log("Fetched Data:", data);
            return data.bookings;
        } else {
            console.error("fetchData error: response")
            throw new Error("Failed to perform server action");
        }
      } catch (error) {
          console.error(error);
      }
  }
  if (session?.user?.email && session?.user?.role == 'Customer'){
    const fetchedData = await fetchData(session?.user?.email);
    if (fetchedData){
      bookingHistoryList = fetchedData['bookingHistory'];
      upcomingBookingsList = fetchedData['upcomingBookings'];
      // console.log("upcomingBookingsList:", upcomingBookingsList);
      // console.log("bookingHistoryList:", bookingHistoryList);
    } else {
      bookingHistoryList = [];
      upcomingBookingsList = [];
    }
  }
  // console.log("Session: ", session);
  // const router = useRouter();
  // const { data: session, status } = useSession();
  // const fetchData = async (bookerEmail: string) => { // retrieve events from spring
  //   try {
  //       // console.log("Email:", bookerEmail);
  //       const encodedEmail = encodeURIComponent('mike@gmail.com'); // need to encode as there's a special character
  //       // console.log("Encoded Email:", encodedEmail);
  //       const response = await fetch(`/api/booking/?bookerEmail=${encodedEmail}`, { cache: 'no-store' });
  //       if (response.ok) {
  //           const data = await response.json();
  //           // console.log("Fetched Data:", data);
  //           setUpcomingBookingsList(data.bookings['upcomingBookings']);
  //           setBookingHistoryList(data.bookings['bookingHistory']);
  //       } else {
  //           console.error("fetchData error: response")
  //           throw new Error("Failed to perform server action");
  //       }
  //   } catch (error) {
  //       console.error(error);
  //   }
  // }
  // useEffect(() => {
  //   console.log("Session: ", session, "Status: ", status);
  //   if(status != "authenticated"){
  //     // router.push('/');
  //     // TODO: User to login and redirect
  //   } else if (session?.user?.email) {
  //     fetchData(session?.user?.email);
  //   }
  // }, [status]);

  // const [upcomingBookingsList, setUpcomingBookingsList] = useState([]);
  // const [bookingHistoryList, setBookingHistoryList] = useState([]);

  // useEffect(() => {
  //   console.log("Upcoming Bookings:", upcomingBookingsList);
  //   console.log("Booking History:", bookingHistoryList);
  // }, [upcomingBookingsList, bookingHistoryList]);
  
  if (session?.user?.role == 'Customer') {
    return (
      <main className="mt-4 mx-28 xl:mx-10 2xl:mx-90">
        <div className="text-nowrap">
          <div id="bookings-div" className="pb-12">
            <div className="flex-col w-full">
                <Tabs defaultValue="upcoming">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-3xl font-bold">Bookings</h2>
                      <div className="w-[50px] border-2 border-black"></div>
                    </div>
                    <TabsList className="w-[400px]">
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="w-full text-wrap mt-4">
                    <TabsContent value="upcoming">
                      {
                        upcomingBookingsList.length == 0 ? <div className="text-slate-400 w-full text-center mt-8">No upcoming bookings</div> 
                        : upcomingBookingsList.map((booking : Booking) => {
                          return (
                            <BookingCard key={booking.bookingID} booking={booking} />
                          )
                        })
                      }
                    </TabsContent>
                    <TabsContent value="past">
                    { 
                        bookingHistoryList.length == 0 ?  <div className="text-slate-400 w-full text-center mt-8">No past bookings</div>
                        : bookingHistoryList.map((booking : Booking) => {
                          return (
                            <BookingCard key={booking.bookingID} booking={booking} />
                          )
                        })
                      }
                    </TabsContent>
                  </div>
                </Tabs>
            </div>
          </div>
        </div>
      </main>
    );
  } else {
    redirect('/');
  }
}
