import { Api } from "@/lib/api"
import Link from "next/link"

export default async function AuthorsPage() {
  const authors = await Api.getAuthors()
  return (
    <div>
      <h1>Authors</h1>

      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            <Link href={`/authors/${author.id}`}>{author.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
