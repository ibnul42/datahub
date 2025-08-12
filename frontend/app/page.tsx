import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-full flex flex-col items-center justify-center p-4 md:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-4xl font-bold">Welcome to datahub</h1>
      {/* Buttons */}
      <div className="flex space-x-4 mt-6">
        <Link
          href="/login"
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 rounded border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
