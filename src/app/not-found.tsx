import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-[50vh] flex-1 flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-muted-foreground text-xl">Page not found</p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2"
      >
        Return Home
      </Link>
    </div>
  );
}
