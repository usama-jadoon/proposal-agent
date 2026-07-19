import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center h-[50vh] gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <Link 
        href="/"
        className="px-4 py-2 mt-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Return Home
      </Link>
    </div>
  );
}
