import type { Author, Book, Booking, Event, User } from "./types"

export const API_URL = process.env.NEXT_PUBLIC_API_SERVER_URL

if (!API_URL) {
  throw new Error("Env `NEXT_PUBLIC_API_SERVER_URL` is not set")
}

export type ApiResponse<T> =
  | {
      success: true
      message: string
      data: T
    }
  | {
      success: false
      message: string
      data: null
    }

export type AuthRequestParams<T = {}> = T & {
  /**
   * Authorization token
   */
  auth: string
}

export class ApiClient {
  static async login(payload: { email: string; password: string }) {
    return this.post<User & { token: string }>("/user/login", payload)
  }

  static async signup(payload: { email: string; name: string; password: string }) {
    return this.post<User & { token: string }>("/user/signup", payload)
  }

  static async getSelf(params: AuthRequestParams, init?: RequestInit) {
    return this.request<User>("/user/self", this.withAuth(params.auth, init))
  }

  static async getMyBookings(params: AuthRequestParams, init?: RequestInit) {
    return this.request<{
      bookingHistory: Booking[]
      upcomingBookings: Booking[]
    }>("/booking/self", this.withAuth(params.auth, init))
  }
  static async getDashboardStats(params: AuthRequestParams, init?: RequestInit) {
    return this.requestRaw<{ stats: { numEvents: number; numBookings: number; numTickets: number } }>(
      "/report/dashboardStatistics",
      this.withAuth(params.auth, init)
    )
  }

  static async getEventReport(
    params: AuthRequestParams<{
      eventId: string | number
    }>,
    init?: RequestInit
  ) {
    const { auth, ...rest } = params
    return this.requestRaw<{
      reportID: number
      event: Event
      numTicketsSold: number
      revenue: number
      numAttended: number
      numBookings: number
    }>(`/report/event/${rest.eventId}`, this.withAuth(auth, init))
  }

  static async getEventReportExport(
    params: AuthRequestParams<{
      eventId: string | number
    }>,
    init?: RequestInit
  ) {
    const { auth, ...rest } = params
    const res = await fetch(API_URL + `/report/event/${rest.eventId}/export`, this.withAuth(auth, init))
    return res.blob()
  }

  static async createEvent(
    params: AuthRequestParams<{
      eventName: string
      venue: string
      startTime: string
      numTotalTickets: number
      price: number
      cancellationFee: number
      thumbnail: string
    }>,
    init?: RequestInit
  ) {
    const { auth, ...rest } = params
    return this.post<Event>("/event", rest, this.withAuth(auth, init))
  }

  static async getEvents(init?: RequestInit) {
    return this.requestRaw<Event[]>("/event", init)
  }
  static async getNewEvents(init?: RequestInit) {
    return this.requestRaw<Event[]>("/event/newEvents", init)
  }

  private static withAuth(token: string, init?: RequestInit) {
    return { ...init, headers: { ...init?.headers, Authorization: `Bearer ${token}` } }
  }

  static async request<T>(input: string, init?: RequestInit) {
    const res = await fetch(API_URL + input, init)
    return res.json() as Promise<ApiResponse<T>>
  }

  static async requestRaw<T>(input: string, init?: RequestInit) {
    const res = await fetch(API_URL + input, init)
    return res.json() as Promise<T>
  }

  static async post<T>(url: string, body: any, init?: RequestInit) {
    return fetch(API_URL + url, {
      ...init,
      method: "POST",
      headers: { ...init?.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json() as Promise<ApiResponse<T>>)
  }
}

export class Api {
  /** AuthorController */
  static async getAuthors() {
    return this.request<Author[]>(`/authors`)
  }

  static async getAuthor(id: string | number) {
    return this.request<Author>(`/authors/${id}`)
  }

  /** BookController */
  static async getBooks() {
    return this.request<Book[]>(`/books`)
  }

  static async getBook(id: string | number) {
    return this.request<Book>(`/books/${id}`)
  }

  /** Internal */
  static async post<T>(input: string, body: any, init?: RequestInit) {
    return this.request<T>(input, {
      ...init,
      method: "POST",
      headers: { ...init?.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  }

  static async request<T>(input: string, init?: RequestInit) {
    const res = await fetch(API_URL + input, init)
    if (!res.ok) {
      throw new Error("Fetch failed: " + (await res.text()))
    }
    return res.json() as T
  }
}
