import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-6">Oops! Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We can't seem to find the page you're looking for. Maybe you're hungry for something else?
      </p>
      <Link 
        href="/" 
        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition"
      >
        Return to Home
      </Link>
    </div>
  );
}