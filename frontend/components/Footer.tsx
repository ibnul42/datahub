"use client";
import Link from "next/link";

interface FooterProps {
  userName?: string;
}

export default function Footer({ userName }: FooterProps) {
  return (
    <footer className="bg-white shadow-inner">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-700 text-sm">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} datahub. All rights reserved.
          </div>

          {/* <nav className="flex space-x-6">
            <Link href="/privacy" className="hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-600">
              Terms of Service
            </Link>
            <Link
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              GitHub
            </Link>
          </nav> */}

          {/* {userName && (
            <div className="mt-4 md:mt-0 font-medium text-gray-600">
              Signed in as {userName}
            </div>
          )} */}
        </div>
      </div>
    </footer>
  );
}
