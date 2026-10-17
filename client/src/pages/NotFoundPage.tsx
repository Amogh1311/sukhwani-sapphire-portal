import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="surface mx-auto max-w-md p-8 text-center">
      <div className="text-5xl">🪷</div>
      <h1 className="mt-4 font-display text-3xl font-semibold">
        Page not found
      </h1>
      <p className="mt-2 text-muted">
        That route doesn't exist in the cultural portal.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
