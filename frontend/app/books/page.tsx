import { Api } from "@/lib/api"
import Link from "next/link"

export default async function BooksPage() {
  const books = await Api.getBooks()
  return (
    <div>
      <h1>Books</h1>

      <h2>All books</h2>

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link href={`/books/${book.id}`}>
              <h3>
                #{book.id} {book.title}
              </h3>
              {book.author && <div>by {book.author.name}</div>}
              <p>{book.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
