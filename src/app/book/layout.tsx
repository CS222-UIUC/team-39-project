// from https://nextjs.org/docs/app/getting-started/layouts-and-pages
export default function BlogLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section>{children}</section>
  }