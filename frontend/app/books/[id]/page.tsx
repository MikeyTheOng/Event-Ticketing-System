import { Api } from "@/lib/api"
import Link from "next/link"

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await Api.getBook(params.id)
  return (
    <div>
      <div>Book detail</div>
      <h1>{book.title}</h1>

      {book.author && (
        <div>
          by <Link href={`/authors/${book.author_id}`}>{book.author.name}</Link>
        </div>
      )}

      <p>{book.description}</p>

      <h2>Related Books</h2>
      <ul>
        {book.author?.books.map((book) => (
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
