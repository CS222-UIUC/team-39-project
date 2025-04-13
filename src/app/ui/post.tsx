// from https://nextjs.org/docs/app/getting-started/layouts-and-pages
import Link from 'next/link'
import { getPosts } from '@/app/lib/posts'
 
export async function Post({ post }) {
  const posts = await getPosts()
 
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
