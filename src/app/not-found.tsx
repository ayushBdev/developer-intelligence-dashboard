import Link from "next/link";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
    return (
        <main className="w-full max-w-lg mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-badge-danger/15 flex items-center justify-center text-badge-danger mb-4">
                <FiAlertCircle className="w-8 h-8" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-bold text-content-primary mb-2">
                Page Not Found
            </h1>

            <p className="text-sm text-content-secondary mb-6 leading-relaxed">
                The page or resource you are looking for does not exist or may have been moved.
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent/90 transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
                <FiArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Return to Home</span>
            </Link>
        </main>
    );
}

