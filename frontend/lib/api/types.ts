export type Book = {
  id: number
  title: string
  description: string
  author?: Author
  author_id: number
  created_at: string
  updated_at: string
}

export type Author = {
  id: number
  name: string
  created_at: string
  updated_at: string

  books: Book[]
}

export type User = {
  email : string,
  name : string,
  role : string,
  bal: number
  token: number
}

export type Event = {
  eventID : number,
  eventName : string,
  venue : string,
  startTime : string,
  numTotalTickets : number,
  numTicketsAvailable : number,
  price : number,
  cancellationFee : number,
  thumbnail : string,
  cancelled : boolean
}

export type Ticket = {
  ticketID : number,
  numGuest : number
}

export type Booking = {
  bookingID : number,
  booker : User,
  event : Event,
  ticketList : Ticket[]
  bookingStatus : String
}