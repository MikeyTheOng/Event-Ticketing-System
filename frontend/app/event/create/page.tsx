"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiClient } from "@/lib/api";
import { Toaster, toast } from "sonner";
// const session = await getServerSession(authOptions);

export default function CreateEvent() {
  const { data: session, status } = useSession();
  // console.log("Session: ", session);
  const router = useRouter();
  useEffect(() => {
    console.log("Session: ", session, "Status: ", status);
    if (status != "authenticated") {
      router.push("/");
    }
  }, [status]);

  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("18:30");
  const [numTotalTickets, setNumTotalTickets] = useState(0.0);
  const [price, setPrice] = useState(0.0);
  const [cancellationFee, setCancellationFee] = useState(0.0);
  const thumbnailImages = [
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // "https://images.unsplash.com/photo-1565035010268-a3816f98589a?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
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
    eventName: string;
    venue: string;
    startTime: string;
    numTotalTickets: number;
    price: number;
    cancellationFee: number;
    thumbnail: string;
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

  const resetValues = () => {
    setEventName("");
    setVenue("");
    setDate(new Date().toISOString().slice(0, 10));
    setTime("18:30");
    setNumTotalTickets(0.0);
    setPrice(0.0);
    setCancellationFee(0.0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    const randomIndex = Math.floor(Math.random() * thumbnailImages.length);
    const newEventData = {
      eventName: formData.eventName,
      venue: formData.venue,
      startTime,
      numTotalTickets: formData.numTotalTickets,
      price: formData.price,
      cancellationFee: formData.cancellationFee,
      thumbnail: thumbnailImages[randomIndex],
    };
    if (!validateForm(newEventData)) {
      toast.error("Invalid form data");
      return;
    }
    if (!session?.user.token) {
      toast.error("User not authenticated");
      return;
    }

    const res = await ApiClient.createEvent({
      ...newEventData,
      auth: session.user.token,
    });
    if (!res.success) {
      console.error("Failed to create event", res);
      toast.error(res.message);
      return;
    }
    console.log("res", res);
    toast.success("Event has been created", {
      description:
        res.data.eventName +
        ", " +
        res.data.venue +
        " (" +
        formatDateString(res.data.startTime) +
        ")",
      action: {
        label: "View",
        onClick: () => {
          router.push(`/event/view/${res.data.eventID}`);
        },
      },
    });
  };

  if (status == "authenticated" && session?.user?.role == "Event Manager") {
    return (
      <main className="mx-28 lg:mx-28 2xl:mx-96">
        <div className="py-6 text-nowrap">
          <h2 className="text-pri-600 text-3xl font-medium">New Event</h2>
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
              <div className="grid col-span-1 items-center gap-1.5">
                <Label htmlFor="numTotalTickets">Total Tickets:</Label>
                <Input
                  id="numTotalTickets"
                  type="number"
                  min="0"
                  placeholder="100"
                  className="placeholder:text-slate-400"
                  onChange={(e) => setNumTotalTickets(Number(e.target.value))}
                />
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
                    className="placeholder:text-slate-400"
                    onChange={(e) => setCancellationFee(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="col-span-2 items-center gap-1.5">
                <Button type="submit" className="w-full">
                  Create
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
