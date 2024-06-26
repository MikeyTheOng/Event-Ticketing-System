import { Api } from "@/lib/api"
import Link from "next/link"

export default async function AuthorDetailPage({ params }: { params: { id: string } }) {
  const author = await Api.getAuthor(params.id)
  return (
    <div>
      <h1>Author Profile</h1>

      <h2>{author.name}</h2>

      <h2>Books</h2>
      <ul>
        {author.books.map((book) => (
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
