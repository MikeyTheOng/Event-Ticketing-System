"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/api";
import { toast, Toaster } from "sonner";
// const session = await getServerSession(authOptions);

export default function UpdateEvent({ params }: { params: { eid: string } }) {
  const { data: session, status } = useSession();
  // console.log("Session: ", session);
  const router = useRouter();
  useEffect(() => {
    console.log("Session: ", session, "Status: ", status);
    if (status != "authenticated") {
      router.push("/");
    }
  }, [status]);

  const eid = params.eid;
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("18:30");
  const [numTotalTickets, setNumTotalTickets] = useState(0);
  const [numTicketsAvailable, setNumTicketsAvailable] = useState(0);
  const [price, setPrice] = useState(0.0);
  const [cancellationFee, setCancellationFee] = useState(0.0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_URL}/event/${params.eid}`, {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data:", data);
          setEventName(data.eventName);
          setVenue(data.venue);
          setDate(data.startTime.slice(0, 10));
          setTime(data.startTime.slice(11, 16));
          setNumTotalTickets(data.numTotalTickets);
          setNumTicketsAvailable(data.numTicketsAvailable);
          setPrice(data.price);
          setCancellationFee(data.cancellationFee);
          return data;
        } else {
          console.error("fetchData error: response");
          throw new Error("Failed to perform server action");
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (status == "authenticated" && session?.user?.role == "Event Manager") {
      fetchData();
    }
  }, []);

  function transformStartDate() {
    // Split date string into year, month, and day
    const [year, month, day] = date.split("-").map(Number);
    // Split time string into hours and minutes
    const [hours, minutes] = time.split(":").map(Number);

    // Create a new Date object with the provided year, month, day, hours, and minutes
    const dateTime = new Date(year, month - 1, day, hours, minutes);

    // Format the date and time components
    const formattedDateTime = `${dateTime.getFullYear()}-${(
      dateTime.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dateTime
      .getDate()
      .toString()
      .padStart(2, "0")}T${dateTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}:00`;

    return formattedDateTime;
  }

  function formatDateString(dateString: string) {
    // Create a Date object from the string
    const date = new Date(dateString);

    // Define options for formatting the date
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric", // 4-digit year
      month: "short", // Short month name (e.g., "Jan", "Feb")
      day: "2-digit", // Day of the month (2-digit)
      weekday: "short", // Short day name (e.g., "Mon", "Tue")
    };

    // Format the date using toLocaleDateString
    const formattedDate = date.toLocaleDateString("en-GB", options);

    return formattedDate;
  }

  const validateForm = (eventData: {
    eventID: string;
    eventName: string;
    venue: string;
    startTime: string;
    numTotalTickets: number;
    price: number;
    cancellationFee: number;
  }) => {
    if (eventData.eventName.length === 0) {
      alert("Event Name cannot be empty");
      return false;
    }
    if (eventData.venue.length === 0) {
      alert("Venue cannot be empty");
      return false;
    }
    if (eventData.numTotalTickets <= 0) {
      alert("Total Tickets must be greater than 0");
      return false;
    }
    if (eventData.price <= 0) {
      alert("Price must be greater than 0");
      return false;
    }
    if (eventData.cancellationFee < 0) {
      alert("Cancellation Fee must be greater than or equal to 0");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      eventName,
      venue,
      date,
      time,
      numTotalTickets,
      price,
      cancellationFee,
    };
    const startTime = transformStartDate();
    const newEventData = {
      eventID: eid,
      eventName: formData.eventName,
      venue: formData.venue,
      startTime,
      numTotalTickets: formData.numTotalTickets,
      numTicketsAvailable: numTicketsAvailable,
      price: formData.price,
      cancellationFee: formData.cancellationFee,
    };
    if (validateForm(newEventData)) {
      const authToken = session?.user.token;
      fetch(`${API_URL}/event/${eid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newEventData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create event");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Event Updated:", data);
          toast.success("Event has been Updated", {
            description:
              data.eventName +
              ", " +
              data.venue +
              " (" +
              formatDateString(data.startTime) +
              ")",
            action: {
              label: "View",
              onClick: () => {
                router.push(`/event/view/${data.eventID}`);
              },
            },
          });
        })
        .catch((error) => {
          console.error("Error creating event:", error);
        });
    }
  };

  if (status == "authenticated" && session?.user?.role == "Event Manager") {
    return (
      <main className="mx-28 lg:mx-28 2xl:mx-96">
        <div className="py-6 text-nowrap">
          <h2 className="text-pri-600 text-3xl font-medium">Update Event</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="grid col-span-1 gap-1.5">
                <Label htmlFor="eventName">Event Name:</Label>
                <Input
                  id="eventName"
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className=""
                />
              </div>
              <div className="grid col-span-1 items-center gap-1.5 w-full">
                <Label htmlFor="venue">Venue:</Label>
                <Input
                  id="venue"
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 col-span-2 gap-4">
                <div className="col-span-1 grid items-center gap-1.5">
                  <Label htmlFor="date">Date:</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    min={new Date().toISOString().slice(0, 10)}
                    onKeyDown={(e) => e.preventDefault()}
                    className="cursor-pointer"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="col-span-1 grid items-center gap-1.5">
                  <Label htmlFor="time">Time:</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    placeholder="16:30"
                    onKeyDown={(e) => e.preventDefault()}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-1.5">
                <div className="grid col-span-1 items-center gap-1.5">
                  <Label htmlFor="numTotalTickets">Total Tickets:</Label>
                  <Input
                    id="numTotalTickets"
                    type="number"
                    min="0"
                    placeholder="100"
                    className="placeholder:text-slate-400"
                    value={numTotalTickets}
                    onChange={(e) => setNumTotalTickets(Number(e.target.value))}
                  />
                </div>
                <div className="grid col-span-1 items-center gap-1.5">
                  <Label htmlFor="numTotalTickets">Tickets Available:</Label>
                  <Input
                    id="numTotalTickets"
                    type="number"
                    min="0"
                    placeholder="100"
                    className="placeholder:text-slate-400"
                    value={numTicketsAvailable}
                    onChange={(e) =>
                      setNumTicketsAvailable(Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-1.5">
                <div>
                  <Label htmlFor="price">Price:</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="0.0"
                    className="placeholder:text-slate-400"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="cancellationFee">Cancellation Fee:</Label>
                  <Input
                    id="cancellationFee"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="0.0"
                    value={cancellationFee}
                    className="placeholder:text-slate-400"
                    onChange={(e) => setCancellationFee(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="col-span-2 items-center gap-1.5">
                <Button type="submit" className="w-full">
                  Update
                </Button>
              </div>
            </div>
          </form>
        </div>
        <Toaster richColors position="bottom-right" />
      </main>
    );
  } else {
    router.push("/");
  }
}
