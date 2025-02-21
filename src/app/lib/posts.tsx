// Define a Post type
export type Post = {
    id: number;
    title: string;
    content: string;
};

// This function simulates fetching posts data.
// You can replace this logic with a fetch call or database query.
export async function getPosts(): Promise<Post[]> {
    // Static example posts
    const posts: Post[] = [
      {
        id: 1,
        title: 'My First Post',
        content: 'Welcome to my blog! This is my very first post.',
      },
      {
        id: 2,
        title: 'Another Day, Another Post',
        content: 'Here is some more content for another post.',
      },
    ];
    
    // In a real scenario, you might await a fetch or database call:
    // const res = await fetch('https://api.example.com/posts');
    // const posts = await res.json();
    
    return posts;
}
  