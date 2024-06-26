import type { Book } from "@/lib/api/types"
import Link from "next/link"

export function BookCard(book: Book) {
  return (
    <Link href={`/books/${book.id}`} >
      <div className="rounded p-4 border border-neutral-500">
        <h3>
          #{book.id} {book.title}
        </h3>
        {book.author && <Link href={`/authors/${book.author_id}`}>by {book.author.name}</Link>}
        <p>{book.description}</p>
      </div>
    </Link>
  )
}
