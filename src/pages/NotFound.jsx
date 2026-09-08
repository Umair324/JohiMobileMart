import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-bazaar-50 text-bazaar-500">
        <Smartphone size={26} />
      </span>
      <h1 className="font-display text-4xl font-extrabold text-ink">404</h1>
      <p className="mt-2 text-ink-faint">
        This page couldn't be found. It may have been moved or the listing sold out.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
