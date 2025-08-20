"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext"; // ✅ use context

export default function Header() {
  const { user, setUser } = useAuthContext(); // ✅ Access global user
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Logout handler
  function handleLogout() {
    localStorage.removeItem("token"); // remove token
    setUser(null); // clear global user state
  }

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", roles: ["admin"] },
    { label: "Users", href: "/users", roles: ["admin"] },
    { label: "Remittance Customer", href: "/customers", roles: ["admin"] },
    { label: "Employee Records", href: "/employees", roles: ["admin"] },
    { label: "m-Cash Agent Record", href: "/agents", roles: ["admin"] },
    { label: "Customer Record", href: "/accounts", roles: ["admin", "user"] },
  ];

  // const filteredLinks = user
  //   ? navLinks.filter((link) => link.roles.includes(user.role))
  //   : [];

  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-500">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              🗄️ DataHub
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full block text-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium text-white"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
