// from https://nextjs.org/docs/app/getting-started/layouts-and-pages
import { Post } from '@/app/ui/post'
import { getPosts } from '@/app/lib/posts'
 
export default async function Page() {
  const posts = await getPosts()
 
  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  )
}