'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Hide the header on the home page.
  if (pathname === "/") return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/85 backdrop-blur dark:border-gray-800 dark:bg-black/85">
      <header className="mx-auto grid w-full max-w-3xl grid-cols-3 items-center px-4 py-3 sm:px-16">
        <Link
          href="/"
          className="shrink-0 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
        >
          ← Back to Toolkit
        </Link>

        <div className="text-center text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          AI Career Toolkit
        </div>

        {/* Empty column to keep the title perfectly centered */}
        <div />
      </header>
    </div>
  );
}

